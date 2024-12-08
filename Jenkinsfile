pipeline {
    agent {
        label 'docker-agent'
    }
    environment {
        PROJECT_KEY = "whatsapp-notificator"
        DOCKER_REPO = "docker.uplide.com/repository/uplide-docker/${PROJECT_KEY}"
        DOCKER_CREDENTIALS_ID = "nexus"
        GITHUB_CREDENTIALS_ID = 'github'
        SERVICE_HOOK_URL = 'https://portainer.uplide.com/api/webhooks/bce872fa-711d-4b34-bb5d-123'
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
                        sh "curl -X POST -H 'Content-Type: application/json' -d '{\"service\": \"efohealth\", \"image\": \"${env.DOCKER_REPO}:${env.BUILD_ID}\", \"tag\": \"${env.BUILD_ID}\", \"service_hook_url\": \"${env.SERVICE_HOOK_URL}\"}' ${env.SERVICE_HOOK_URL}"
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
