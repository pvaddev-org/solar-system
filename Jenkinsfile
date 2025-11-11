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

        stage('SAST - SonarQube') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner-7'
                    withSonarQubeEnv('SonarScanner-7') {
                        sh """
                        export SONAR_SCANNER_OPTS="-Xmx1024m"
                        ${scannerHome}/bin/sonar-scanner \
                        -Dsonar.projectKey=Solar-System-Project \
                        -Dsonar.sources=.
                    """
                    }
                }

                waitForQualityGate abortPipeline: true
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, testResults: 'reports/junit/test-results.xml', skipPublishingChecks: true

       //   junit allowEmptyResults: true, keepProperties: true, testResults: 'dependency-check-junit.xml'

        //  publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, icon: '', keepAll: true, reportDir: './', reportFiles: 'dependency-check-jenkins.html', reportName: 'Dependancy Check HTML Report', reportTitles: '', useWrapperFileDirectly: true])
        }
    }
}   