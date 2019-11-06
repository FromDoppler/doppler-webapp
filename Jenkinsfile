pipeline {
    agent any
    stages {
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
        stage('Build') {
            steps {
                sh '''docker build \\
                    --target build \\
                    --build-arg environment=production \\
                    --build-arg react_app_router=browser \\
                    --build-arg public_url="/" \\
                    -f Dockerfile.swarm \\
                    .'''
            }
        }
        stage('Build final version images') {
            when { allOf { buildingTag(); tag pattern: "v\\d+\\.\\d+\\.\\d+", comparator: "REGEXP" } }
            steps {
                // TODO: add missing environments (development, qa, int)
                // TODO: remove build differences based on environments to allow reducing the
                // number of different images. Maybe `demo` and `production` cold be enought
                sh '''docker build \
                    -t "fromdoppler/doppler-webapp:production-commit-${GIT_COMMIT}" \\
                    --build-arg environment=production \\
                    --build-arg react_app_router=browser \\
                    --build-arg public_url="/" \\
                    --build-arg version=production-${TAG_NAME}+${GIT_COMMIT} \\
                    -f Dockerfile.swarm \\
                    .'''
                sh '''docker build \
                    -t "fromdoppler/doppler-webapp:demo-commit-${GIT_COMMIT}" \\
                    --build-arg environment=demo \\
                    --build-arg react_app_router=browser \\
                    --build-arg public_url="/" \\
                    --build-arg version=demo-${TAG_NAME}+${GIT_COMMIT} \\
                    -f Dockerfile.swarm \\
                    .'''
            }
        }
        stage('Publish final version images') {
            when { allOf { buildingTag(); tag pattern: "v\\d+\\.\\d+\\.\\d+", comparator: "REGEXP" } }
            steps {
                // TODO: add missing environments (development, qa, int)
                sh 'sh publish-commit-image-to-dockerhub.sh production ${GIT_COMMIT} ${TAG_NAME}'
                sh 'sh publish-commit-image-to-dockerhub.sh demo ${GIT_COMMIT} ${TAG_NAME}'
            }
        }
        stage('Generate version') {
            when {
                branch 'master'
            }
            steps {
                // TODO: by the moment this work is being done by another Jenkins task
                sh 'echo TODO: Run semantic release to generate version tag and github release'
            }
        }
    }
}
