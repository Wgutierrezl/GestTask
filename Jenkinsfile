pipeline {
  agent any

  environment {
    AWS_REGION = 'us-east-1'

    ECR_REPOSITORY = credentials('ECR_REPOSITORY_DEV')
    IMAGE_NAME     = 'gesttask_dev'
    IMAGE_TAG      = 'latest'

    CLUSTER_NAME = 'cluster-gt-stack-v2'
    SERVICE_NAME = 'service-gt-dev'
    TASK_FAMILY  = 'tasg-gt-dev'
  }

  stages {

    stage('🧩 Checkout') {
      steps {
        checkout scm
      }
    }

    stage('🏗️ Build Docker Image') {
      when {
        expression { env.BRANCH_NAME == 'GT_Oauth0_Jenkins' }
      }
      steps {
        sh '''
          docker build -t $IMAGE_NAME .
          docker tag $IMAGE_NAME:$IMAGE_TAG $ECR_REPOSITORY:$IMAGE_TAG
        '''
      }
    }

    stage('🔐 Login to Amazon ECR') {
      steps {
        sh '''
          aws ecr get-login-password --region $AWS_REGION \
          | docker login --username AWS --password-stdin $ECR_REPOSITORY
        '''
      }
    }

    stage('📤 Push Image to ECR') {
      steps {
        sh '''
          docker push $ECR_REPOSITORY:$IMAGE_TAG
        '''
      }
    }

    stage('🧾 Render new task definition') {
      steps {
        sh '''
          aws ecs describe-task-definition \
            --task-definition $TASK_FAMILY \
            --query taskDefinition > taskdef.json

          jq 'del(
            .taskDefinitionArn,
            .revision,
            .status,
            .requiresAttributes,
            .compatibilities,
            .registeredAt,
            .registeredBy
          )' taskdef.json > cleaned-task-def.json

          jq --arg IMAGE "$ECR_REPOSITORY:$IMAGE_TAG" \
            '.containerDefinitions[0].image = $IMAGE' \
            cleaned-task-def.json > new-task-def.json
        '''
      }
    }

    stage('🆕 Register new task definition revision') {
      steps {
        sh '''
          aws ecs register-task-definition \
            --cli-input-json file://new-task-def.json \
            --query "taskDefinition.taskDefinitionArn" \
            --output text > revision.txt
        '''
      }
    }

    stage('🚀 Update ECS Service (DEV)') {
      steps {
        sh '''
          aws ecs update-service \
            --cluster $CLUSTER_NAME \
            --service $SERVICE_NAME \
            --task-definition $(cat revision.txt) \
            --force-new-deployment
        '''
      }
    }
  }
}
