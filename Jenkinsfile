pipeline {
    agent any
    stages {
        stage('Restore') {
            steps {
                sh 'docker build --target restore -f Dockerfile.next .'
            }
        }
        stage('Test') {
            steps {
                sh 'docker build --target test -f Dockerfile.next .'
            }
        }
        stage('Build') {
            steps {
                // TODO: remove build differences based on environments to allow reducing the
                // number of different images. Maybe `demo` and `production` cold be enought
                sh '''docker build \\
                    -t "fromdoppler/doppler-webapp:pre-demo-commit-${GIT_COMMIT}" \\
                    --build-arg environment=demo \\
                    --build-arg version=commit-${GIT_COMMIT} \\
                    --build-arg react_app_router=browser \\
                    --build-arg public_url="/" \\
                    -f Dockerfile.next \\
                    .'''
                sh '''docker build \
                    -t "fromdoppler/doppler-webapp:pre-development-commit-${GIT_COMMIT}" \\
                    --build-arg environment=development \\
                    --build-arg version=commit-${GIT_COMMIT} \\
                    --build-arg react_app_router=browser \\
                    --build-arg public_url="/" \\
                    -f Dockerfile.next \\
                    .'''
                sh '''docker build \\
                    -t "fromdoppler/doppler-webapp:pre-int-commit-${GIT_COMMIT}" \\
                    --build-arg environment=int \\
                    --build-arg version=commit-${GIT_COMMIT} \\
                    --build-arg react_app_router=browser \\
                    --build-arg public_url="/" \\
                    -f Dockerfile.next \\
                    .'''
                sh '''docker build \\
                    -t "fromdoppler/doppler-webapp:pre-qa-commit-${GIT_COMMIT}" \\
                    --build-arg environment=qa \\
                    --build-arg version=commit-${GIT_COMMIT} \\
                    --build-arg react_app_router=browser \\
                    --build-arg public_url="/" \\
                    -f Dockerfile.next \\
                    .'''
                sh '''docker build \\
                    -t "fromdoppler/doppler-webapp:pre-production-commit-${GIT_COMMIT}" \\
                    --build-arg environment=production \\
                    --build-arg version=commit-${GIT_COMMIT} \\
                    --build-arg react_app_router=browser \\
                    --build-arg public_url="/" \\
                    -f Dockerfile.next \\
                    .'''
            }
        }
        stage('Publish PR build to DockerHub') {
            when {
                changeRequest()
            }
            steps {
                sh 'echo TODO: Add tags for each image and publish to docker hub'
            }
        }
        stage('Generate version') {
            when {
                branch 'master'
            }
            steps {
                sh 'echo TODO: Run semantic release to generate version tag and github release'
            }
        }
        stage('Publish tag build to DockerHub') {
            when {
                buildingTag()
                tag pattern: "v\\d+\\.\\d+\\.\\d+", comparator: "REGEXP"
            }
            steps {
                sh 'echo TODO: Add tags for each image and publish to docker hub'
            }
        }
    }
}
