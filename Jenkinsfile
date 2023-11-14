pipeline {
    agent any
    stages { 
        stage('Clone Repository') {
            steps {
                git (
                    credentialsId: 'c2a2981b-5af1-451a-a61e-0cc7b591268d', 
                    url: 'http://172.31.12.207:7080/git/jt0191340/rfidsystem-angular.git',
                    branch: 'code-debug', 
                    poll: true
                    )
            }
        }

       stage('Installing Dependencies') {
            steps {
                     bat 'npm install'
            }
        }

       stage('Building') {
            steps {
                     bat 'npm run build'
            }
        }

       stage('Scan SonarQube analysis') {
            steps {
                script {
                  withSonarQubeEnv(installationName: 'Sonarqube-Server', credentialsId: 'Sonarqube-Access') {
                        bat 'npm run sonar'

                    }
                } 
            }
        }

       stage('SonarQube Quality Gate') {
            steps {
                    script {
                  environment { 
                            HTTP_PROXY = 'http://jt0191340:jt01913401@10.10.10.10:8080'
                            HTTPS_PROXY = 'http://jt0191340:jt01913401@10.10.10.10:8080'
                             def qualitygate = waitForQualityGate()
                              if (qualitygate.status != "OK") {
                                 error "Pipeline failed due to quality gate result: ${qualitygate.status}"
                              }
                        }
                    }
                } 
            }
    }
}
