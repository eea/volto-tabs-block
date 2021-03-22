pipeline {
  agent any

  environment {
    GIT_NAME = "volto-tabs-block"
    NAMESPACE = "@eeacms"
    SONARQUBE_TAGS = "volto.eea.europa.eu",
    DEPENDENCIES = "volto-slate"
  }

  stages {

    stage('Code') {
      steps {
        parallel(

          "ES lint": {
            node(label: 'docker') {
              sh '''docker pull plone/volto-addon-ci; docker run -i --rm --name="$BUILD_TAG-eslint" -e NAMESPACE="$NAMESPACE" -e DEPENDENCIES="$DEPENDENCIES" -e GIT_NAME=$GIT_NAME -e GIT_BRANCH="$BRANCH_NAME" -e GIT_CHANGE_ID="$CHANGE_ID" plone/volto-addon-ci eslint'''
            }
          },

          "Style lint": {
            node(label: 'docker') {
              sh '''docker pull plone/volto-addon-ci; docker run -i --rm --name="$BUILD_TAG-stylelint" -e NAMESPACE="$NAMESPACE" -e DEPENDENCIES="$DEPENDENCIES" -e GIT_NAME=$GIT_NAME -e GIT_BRANCH="$BRANCH_NAME" -e GIT_CHANGE_ID="$CHANGE_ID" plone/volto-addon-ci stylelint'''
            }
          },

          "Prettier": {
            node(label: 'docker') {
              sh '''docker pull plone/volto-addon-ci; docker run -i --rm --name="$BUILD_TAG-prettier" -e NAMESPACE="$NAMESPACE" -e DEPENDENCIES="$DEPENDENCIES" -e GIT_NAME=$GIT_NAME -e GIT_BRANCH="$BRANCH_NAME" -e GIT_CHANGE_ID="$CHANGE_ID" plone/volto-addon-ci prettier'''
            }
          }
        )
      }
    }

    stage('Integration tests') {
      steps {
        parallel(

          "Cypress": {
            node(label: 'docker') {
              script {
                try {
                  sh '''docker pull plone; docker run -d --name="$BUILD_TAG-plone" -e SITE="Plone" -e PROFILES="profile-plone.restapi:blocks" plone fg'''
                  sh '''docker pull plone/volto-addon-ci; docker run -i --name="$BUILD_TAG-cypress" --link $BUILD_TAG-plone:plone -e NAMESPACE="$NAMESPACE" -e DEPENDENCIES="$DEPENDENCIES" -e GIT_NAME=$GIT_NAME -e GIT_BRANCH="$BRANCH_NAME" -e GIT_CHANGE_ID="$CHANGE_ID" plone/volto-addon-ci cypress'''
                } finally {
                  sh '''mkdir -p cypress-reports'''
                  sh '''docker cp $BUILD_TAG-cypress:/opt/frontend/my-volto-project/src/addons/$GIT_NAME/cypress/videos cypress-reports/'''
                  stash name: "cypress-reports", includes: "cypress-reports/**/*"
                  archiveArtifacts artifacts: 'cypress-reports/videos/*.mp4', fingerprint: true
                  sh '''echo "$(docker stop $BUILD_TAG-plone; docker rm -v $BUILD_TAG-plone; docker rm -v $BUILD_TAG-cypress)" '''
                }
              }
            }
          }

        )
      }
    }
  }

  post {
    changed {
      script {
        def url = "${env.BUILD_URL}/display/redirect"
        def status = currentBuild.currentResult
        def subject = "${status}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'"
        def summary = "${subject} (${url})"
        def details = """<h1>${env.JOB_NAME} - Build #${env.BUILD_NUMBER} - ${status}</h1>
                         <p>Check console output at <a href="${url}">${env.JOB_BASE_NAME} - #${env.BUILD_NUMBER}</a></p>
                      """

        def color = '#FFFF00'
        if (status == 'SUCCESS') {
          color = '#00FF00'
        } else if (status == 'FAILURE') {
          color = '#FF0000'
        }

        emailext (subject: '$DEFAULT_SUBJECT', to: '$DEFAULT_RECIPIENTS', body: details)
      }
    }
  }
}
