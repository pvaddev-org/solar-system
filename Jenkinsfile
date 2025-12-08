pipeline {
    agent any

    environment {
     CLUSTER_IP = credentials('ClusterIP')
    }


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

        // stage('Trivy Vulnerability Image Scanner') {
        //     steps {
        //         sh '''
        //            trivy image pvaddocker/solar-system:$GIT_COMMIT \
        //                 --severity LOW,MEDIUM \
        //                 --exit-code 0 \
        //                 --quiet \
        //                 --format json -o trivy-image-MEDIUM-results.json

        //             trivy image pvaddocker/solar-system:$GIT_COMMIT \
        //                 --severity HIGH,CRITICAL \
        //                 --exit-code 1 \
        //                 --quiet \
        //                 --format json -o trivy-image-CRITICAL-results.json
        //            '''
        //     }

        //     post {
        //         always {
        //             sh '''
        //                 trivy convert \
        //                     --format template --template "@/usr/local/share/trivy/templates/html.tpl" \
        //                     --output trivy-image-MEDIUM-results.html trivy-image-MEDIUM-results.json

        //                 trivy convert \
        //                     --format template --template "@/usr/local/share/trivy/templates/html.tpl" \
        //                     --output trivy-image-CRITICAL-results.html trivy-image-CRITICAL-results.json

        //                 trivy convert \
        //                     --format template --template "@/usr/local/share/trivy/templates/junit.tpl" \
        //                     --output trivy-image-MEDIUM-results.xml trivy-image-MEDIUM-results.json

        //                 trivy convert \
        //                     --format template --template "@/usr/local/share/trivy/templates/junit.tpl" \
        //                     --output trivy-image-CRITICAL-results.xml trivy-image-CRITICAL-results.json
        //             '''
        //         }
        //     }
        // }

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
                                    sudo docker run --name solar-system \
                                        -e MONGO_URI=$MONGO_URI \
                                        -p 3000:3000 -d pvaddocker/solar-system:$GIT_COMMIT
                            "
                        '''
                    }
                }    
            }
        }

        stage('Integration Testing - AWS EC2') {
            when { branch 'feature/*'}
            
            steps {
                withCredentials([string(credentialsId: 'jenkins-role-arn', variable: 'ROLE_ARN')]) {
                    withAWS(credentials: 'aws-creds', region: 'us-east-1', role: ROLE_ARN, roleSessionName: 'jenkins') {
                        sh '''
                            bash integration-testing.sh
                        '''
                    }
                }
            }
        }

        stage('K8S Update Image Tag') {
            when { branch 'PR*'}
            
            steps {
                withCredentials([usernamePassword( credentialsId: 'jenkins-ci-bot-creds', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_TOKEN')]) {

                    sh 'git clone -b main https://github.com/pvaddev/solar-system-gitops-repo.git'

                    dir("solar-system-gitops-repo/kubernetes") {
                        sh """
                            git checkout main
                            git checkout -b feature-$BUILD_ID

                            sed -i "s#pvaddocker/solar-system:.*#pvaddocker/solar-system:$GIT_COMMIT#g" deployment.yml

                            git config user.email "jenkins@user.com"
                            git config user.name "jenkins-ci-bot"

                            git remote set-url origin https://${GIT_USER}:${GIT_TOKEN}@github.com/pvaddev/solar-system-gitops-repo.git

                            git add deployment.yml
                            git commit -m "Update image tag to $GIT_COMMIT"
                            git push -u origin feature-$BUILD_ID
                        """
                    }
                }
            }
        }

        stage('K8S - Raise PR') {
            when { branch 'PR*'}
            
            steps {
                withCredentials([string(credentialsId: 'jenkins-git-token', variable: 'GIT_TOKEN')]) {
                    sh """
                        curl -L -X POST \
                        -H "Accept: application/vnd.github+json" \
                        -H "Authorization: Bearer \$GIT_TOKEN" \
                        -H "X-GitHub-Api-Version: 2022-11-28" \
                        https://api.github.com/repos/pvaddev/solar-system-gitops-repo/pulls \
                        -d '{
                            "title": "Automated update from Jenkins build $BUILD_ID",
                            "body": "This PR was created automatically by Jenkins to update docker image in deployment.yml",
                            "head": "feature-$BUILD_ID",
                            "base": "main"
                        }'
                    """
                }
            }
        }

        stage('App Deployed?') {
            when { branch 'PR*'}
            steps {
                timeout(time: 1, unit: 'DAYS') {
                    input message: 'Is the PR Merged and ArgoCD Synced?', ok: 'YES! PR is Merged and ArgoCD Application Synced'
                }
            }
        }

        // stage('DAST - OWASP ZAP') {
        //     when { branch 'PR*'}
            
        //     steps {
        //         sh '''
        //             chmod 777 $(pwd)
        //             docker run --rm -v $(pwd):/zap/wrk/:rw ghcr.io/zaproxy/zaproxy zap-api-scan.py \
        //             -t http://$CLUSTER_IP:30000/api-docs/ \
        //             -f openapi \
        //             -r zap_report.html \
        //             -c zap-ignore_rules
        //         '''
        //     }
        // }
        stage('Upload report - AWS S3') {
            when { branch 'PR*'}
            
            steps {
                withCredentials([string(credentialsId: 'jenkins-role-arn', variable: 'ROLE_ARN')]) {
                    withAWS(credentials: 'aws-creds', region: 'us-east-1', role: ROLE_ARN, roleSessionName: 'jenkins') {
                        sh '''
                            ls -ltr
                            mkdir reports-$BUILD_ID/
                            cp zap*.* reports-$BUILD_ID/
                            ls -ltr reports-$BUILD_ID/
                        '''
                        s3Upload(file:"reports-$BUILD_ID", bucket:'jenkins-reporting-bucket', path:"jenkins-$BUILD_ID/")
                    }    
                }           
            }
        }

        stage('Deploy to Prod') {
            when { branch 'main'}
            steps {
                timeout(time: 1, unit: 'DAYS') {
                    input message: 'Deploy to Production?', ok: 'YES! Let us try this on Production', submitter: 'pvaddev'
                }
            }
        }

        stage('Lambda - S3 Upload & Deploy') {
            when { branch 'main'}
            steps {
                withAWS(credentials: 'aws-creds', region: 'us-east-1', role: ROLE_ARN, roleSessionName: 'jenkins') {
                    sh '''
                        sed -i "/^module\\.exports = app;/,/^}/ s/^/\\/\\//" app.js
                        sed -i "s|^//module.exports.handler|module.exports.handler|" app.js
                    '''
                    sh '''
                       zip -qr solar-system-lambda-$BUILD_ID.zip  app* package* index.html node*
                       ls -ltr solar-system-lambda-$BUILD_ID.zip
                    '''
                    s3Upload(file:"solar-system-lambda-${BUILD_ID}.zip", bucket:'solar-system-app-lambda-bucket')
                    sh '''
                       aws lambda update-function-code \
                           --function-name solar-system-function \
                           --s3-bucket solar-system-app-lambda-bucket \
                           --s3-key solar-system-lambda.zip
                    '''
                }    
            }
        }
    }

    post {
        always {
            script {
                if (fileExists("solar-system-gitops-repo")) {
                    sh "rm -rf solar-system-gitops-repo"
                }
            }
            junit allowEmptyResults: true, testResults: 'reports/junit/test-results.xml', skipPublishingChecks: true

            publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true, reportDir: './', reportFiles: 'zap_report.html', reportName: 'DAST - OWASP - OWASP ZAP Report', reportTitles: '', useWrapperFileDirectly: true])

            publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true, reportDir: './', reportFiles: 'trivy-image-CRITICAL-results.html', reportName: 'Trivy Image Critical Vul Report', reportTitles: '', useWrapperFileDirectly: true])

            publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true, reportDir: './', reportFiles: 'trivy-image-MEDIUM-results.html', reportName: 'Trivy Image Medium Vul Report', reportTitles: '', useWrapperFileDirectly: true])
            junit allowEmptyResults: true, keepProperties: true, testResults: 'dependency-check-junit.xml'

            publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, icon: '', keepAll: true, reportDir: './', reportFiles: 'dependency-check-jenkins.html', reportName: 'Dependancy Check HTML Report', reportTitles: '', useWrapperFileDirectly: true])
        }
    }
}   