pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Restore') {
            steps {
                dir('HotByte') {
                    bat 'dotnet restore'
                }
            }
        }

        stage('Backend Build') {
            steps {
                dir('HotByte') {
                    bat 'dotnet build --configuration Release'
                }
            }
        }

        stage('Frontend Install') {
            steps {
                dir('hotbyte-frontend') {
                    bat 'npm install'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('hotbyte-frontend') {
                    bat 'npm run build'
                }
            }
        }
stage('Deploy Frontend to IIS') {
    steps {
        bat 'xcopy /E /Y /I hotbyte-frontend\\dist C:\\inetpub\\wwwroot\\hotbyte'
    }
}
    }
}