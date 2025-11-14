pipeline {
    agent any

    stages {
        stage('Installing Dependancies') {
            steps {
                sh 'npm install --no-audit'
            }
        }

        stage('Dependancy scanning') {
            parallel {
                stage('NPM Dependancy Audit ') {
                    steps {
                        sh '''npm audit --audit-level=critical
                            echo $?
                        '''
                    }
                }

                // stage('OWASP Dependency Check') {
                //     steps {
                //         dependencyCheck additionalArguments: '''
                //             --scan \'./' 
                //             --out \'./\' 
                //             --format \'ALL\' 
                //             --disableYarnAudit \
                //             --prettyPrint''', odcInstallation: 'OWASP-DepCheck-12'
                //     }
                // }
            }
        }

        stage('Unit Testing') {
            options { retry(2) }
            steps {
                withCredentials([string(credentialsId: 'mongo-uri', variable: 'MONGO_URI')]) {
                    sh '''
                        mkdir -p reports/junit
                        npm test
                       '''
                }
            }
        }

        // stage('SAST - SonarQube') {
            // steps {
            //     script {
            //         def scannerHome = tool 'SonarScanner-7'
            //         withSonarQubeEnv('SonarScanner-7') {
            //             sh """
            //                 export SONAR_SCANNER_OPTS="-Xmx1024m"
            //                 ${scannerHome}/bin/sonar-scanner \
            //                 -Dsonar.projectKey=Solar-System-Project \
            //                 -Dsonar.sources=.
            //             """
            //         }
            //     }
               // timeout(time: 60, unit: 'SECONDS') {
               // waitForQualityGate abortPipeline: true
                //}
            // }
        // }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t pvaddocker/solar-system:$GIT_COMMIT .'
            }
        }

        stage('Trivy Vulnerability Image Scanner') {
            steps {
                sh '''
                   trivy image pvaddocker/solar-system:$GIT_COMMIT \
                        --severity LOW,MEDIUM \
                        --exit-code 0 \
                        --quiet \
                        --format json -o trivy-image-MEDIUM-results.json

                    trivy image pvaddocker/solar-system:$GIT_COMMIT \
                        --severity HIGH,CRITICAL \
                        --exit-code 1 \
                        --quiet \
                        --format json -o trivy-image-CRITICAL-results.json
                   '''
            }

            post {
                always {
                    sh '''
                        trivy convert \
                            --format template --template "@/usr/local/share/trivy/templates/html.tpl" \
                            --output trivy-image-MEDIUM-results.html trivy-image-MEDIUM-results.json

                        trivy convert \
                            --format template --template "@/usr/local/share/trivy/templates/html.tpl" \
                            --output trivy-image-CRITICAL-results.html trivy-image-CRITICAL-results.json

                        trivy convert \
                            --format template --template "@/usr/local/share/trivy/templates/junit.tpl" \
                            --output trivy-image-MEDIUM-results.xml trivy-image-MEDIUM-results.json

                        trivy convert \
                            --format template --template "@/usr/local/share/trivy/templates/junit.tpl" \
                            --output trivy-image-CRITICAL-results.xml trivy-image-CRITICAL-results.json
                    '''
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                withDockerRegistry(credentialsId: 'dockerhub-creds', url: "") {
                    sh 'docker push pvaddocker/solar-system:$GIT_COMMIT'
                }
            }
        }

        stage('Deploy - AWS EC2') {
            when {
                branch 'feature/*'
            }
            steps {
                script {
                    sshagent(['AWS-dev-deploy-ssh-key']) {
                        sh'''
                            ssh -o StrictHostKeyChecking=no ubuntu@204.236.209.74 "
                                if sudo docker ps -a | grep -q "solar-system"; then
                                        echo "Stopping container..."
                                            sudo docker stop "solar-system" && sudo docker rm "solar-system"
                                        echo "Container stopped and removed."
                                fi
                                    sudo docker run  --name solar-system \
                                        -e MONGO_URI=$MONGO_URI \
                                        -p 3000:3000 -d pvaddocker/solar-system:$GIT_COMMIT
                            "
                        '''
                    }
                }    
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, testResults: 'reports/junit/test-results.xml', skipPublishingChecks: true

            publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true, reportDir: './', reportFiles: 'trivy-image-CRITICAL-results.html', reportName: 'Trivy Image Critical Vul Report', reportTitles: '', useWrapperFileDirectly: true])

            publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true, reportDir: './', reportFiles: 'trivy-image-MEDIUM-results.html', reportName: 'Trivy Image Medium Vul Report', reportTitles: '', useWrapperFileDirectly: true])
       //   junit allowEmptyResults: true, keepProperties: true, testResults: 'dependency-check-junit.xml'

        //  publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, icon: '', keepAll: true, reportDir: './', reportFiles: 'dependency-check-jenkins.html', reportName: 'Dependancy Check HTML Report', reportTitles: '', useWrapperFileDirectly: true])
        }
    }
}   