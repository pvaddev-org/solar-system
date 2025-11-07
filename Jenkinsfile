pipeline {
    agent any

    environment {
        MONGO_URI = "mongodb+srv://superuser:SuperPassword@supercluster.d83jj.mongodb.net/superData"
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
                //             --prettyPrint''', odcInstallation: 'OWASP-DepCheck-12'

                //         dependencyCheckPublisher failedTotalCritical: 1, pattern: 'dependency-check-report.xml', stopBuild: true

                //         junit allowEmptyResults: true, keepProperties: true, testResults: 'dependency-check-junit.xml'

                //         publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, icon: '', keepAll: true, reportDir: './', reportFiles: 'dependency-check-jenkins.html', reportName: 'Dependancy Check HTML Report', reportTitles: '', useWrapperFileDirectly: true])
                //     }
                // }
            }
        }

        stage('Unit Testing') {
            steps {
                withCredentials([string(credentialsId: 'mongo-uri', variable: 'MONGO_URI')]) {
                    sh 'npm test'
                }

                junit allowEmptyResults: true, keepProperties: true, testResults: 'test-results.xml'
            }
        }
    }
}   