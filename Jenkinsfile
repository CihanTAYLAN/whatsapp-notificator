pipeline {
    agent {
        label 'docker-agent'
    }
    environment {
        PROJECT_KEY = "cihan-whatsapp-notificator"
        DOCKER_REPO = "docker.uplide.com/repository/uplide-docker/${PROJECT_KEY}"
        DOCKER_CREDENTIALS_ID = "nexus"
        GITHUB_CREDENTIALS_ID = 'github'
        SERVICE_HOOK_URL = 'https://portainer.uplide.com/api/webhooks/34d55b0b-d26a-44f7-bb15-5a51573c845c'
        // SONARQUBE_URL = 'https://sonarqube.uplide.com'
    }
    stages {
        stage('BUILD') {
            steps {
                script {
                   docker.build("${env.DOCKER_REPO}:${env.BUILD_ID}")
                }
            }
        }
        stage('TAG') {
            steps {
                sh "docker tag ${env.DOCKER_REPO}:${env.BUILD_ID} ${env.DOCKER_REPO}:latest"
            }
        }
        stage('PUSH') {
            steps {
                script {
                    docker.withRegistry("http://${env.DOCKER_REPO}", "${env.DOCKER_CREDENTIALS_ID}") {
                        docker.image("${env.DOCKER_REPO}:${env.BUILD_ID}").push()
                        docker.image("${env.DOCKER_REPO}:latest").push()
                    }
                }
            }
        }
        stage('DEPLOY') {
            steps {
                script {
                    if (env.SERVICE_HOOK_URL != null && env.SERVICE_HOOK_URL != '') {
                        sh "curl -X POST -H 'Content-Type: application/json' -d '{\"service\": \"${env.PROJECT_KEY}\", \"image\": \"${env.DOCKER_REPO}:${env.BUILD_ID}\", \"tag\": \"${env.BUILD_ID}\", \"service_hook_url\": \"${env.SERVICE_HOOK_URL}\"}' ${env.SERVICE_HOOK_URL}"
                    }
                }
            }
        }
        stage('CLEANUP') {
            steps {
                script {
                    sh "docker rmi ${env.DOCKER_REPO}:${env.BUILD_ID}"
                    sh "docker rmi ${env.DOCKER_REPO}:latest"
                }
            }
        }
        // stage('SONARQUBE') {
        //     steps {
        //         withCredentials([string(credentialsId: 'SonarqubeSecret', variable: 'SONARQUBE_TOKEN')]) {
        //             sh "sonar-scanner \
        //                 -Dsonar.projectKey=$PROJECT_KEY \
        //                 -Dsonar.sources=. \
        //                 -Dsonar.host.url=$SONARQUBE_URL \
        //                 -Dsonar.token=$SONARQUBE_TOKEN"
        //         }
        //     }
        // }
    }
    post {
        always {
            cleanWs()
        }
    }
}
