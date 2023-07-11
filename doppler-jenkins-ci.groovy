pipeline {
    agent any
    stages {
        stage('Identification') {
            steps {
                sh 'echo Change request author: ${CHANGE_AUTHOR} '
            }
        }
        stage('Restore') {
            steps {
                sh 'docker build --target restore -f Dockerfile.swarm .'
            }
        }
        stage('Test') {
            steps {
                sh 'docker build --target test -f Dockerfile.swarm .'
            }
        }
        stage('Docker PR Build') {
            when {
                changeRequest target: 'master'
            }
            steps {
                sh '''docker build \
                    -t "local-doppler-webapp:production-commit-${GIT_COMMIT}" \
                    --build-arg environment=production \
                    --build-arg version="local-doppler-webapp:production-commit-${GIT_COMMIT}" \
                    -f Dockerfile.swarm \
                    .'''
            }
        }
        stage('Publish images to Docker Hub') {
            environment {
                DOCKER_CREDENTIALS_ID = "dockerhub_dopplerdock"
                DOCKER_IMAGE_NAME = "dopplerdock/doppler-webapp"
            }
            stages {
                stage('Publish pre-release images from master') {
                    when {
                        branch 'master'
                    }
                    steps {
                        withDockerRegistry(credentialsId: "${DOCKER_CREDENTIALS_ID}", url: "") {
                            sh '''sh build-n-publish.sh \
                                --image=${DOCKER_IMAGE_NAME} \
                                --commit=${GIT_COMMIT} \
                                --name=master \
                                --environment=qa \
                                '''
                        }
                    }
                }
                stage('Publish pre-release images from INT') {
                    when {
                        branch 'INT'
                    }
                    steps {
                        withDockerRegistry(credentialsId: "${DOCKER_CREDENTIALS_ID}", url: "") {
                            sh '''sh build-n-publish.sh \
                                --image=${DOCKER_IMAGE_NAME} \
                                --commit=${GIT_COMMIT} \
                                --name=INT \
                                --environment=int \
                                '''
                        }
                    }
                }
                stage('Publish final version images') {
                    when {
                        expression {
                            return isVersionTag(readCurrentTag())
                        }
                    }
                    steps {
                        withDockerRegistry(credentialsId: "${DOCKER_CREDENTIALS_ID}", url: "") {
                            sh '''sh build-n-publish.sh \
                                --image=${DOCKER_IMAGE_NAME} \
                                --commit=${GIT_COMMIT} \
                                --version=${TAG_NAME} \
                                --environment=production \
                                '''
                        }
                    }
                }
            }
        }
    }
}

def boolean isVersionTag(String tag) {
    echo "checking version tag $tag"

    if (tag == null) {
        return false
    }

    // use your preferred pattern
    def tagMatcher = tag =~ /v\d+\.\d+\.\d+/

    return tagMatcher.matches()
}

// https://stackoverflow.com/questions/56030364/buildingtag-always-returns-false
// workaround https://issues.jenkins-ci.org/browse/JENKINS-55987
def String readCurrentTag() {
    return sh(returnStdout: true, script: 'echo ${TAG_NAME}').trim()
}
