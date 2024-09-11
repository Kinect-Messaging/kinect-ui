targetScope = 'resourceGroup'

// ------------------
//    PARAMETERS
// ------------------

@description('The location where the resources will be created.')
param location string = resourceGroup().location

@description('Optional. The tags to be assigned to the created resources.')
param tags object = {}

@description('The resource Id of the container apps environment.')
param containerAppsEnvironmentId string

@description('The name of the container for the service. The name is use as Dapr App ID.')
param containerName string

// Container Registry & Image
@description('The name of the container registry.')
param containerRegistryName string

//@description('The resource ID of the user assigned managed identity for the container registry to be able to pull images from it.')
//param containerRegistryUserAssignedIdentityId string

@description('The username for the container registry to be able to pull images from it.')
param containerRegistryUsername string

@secure()
@description('The password secret reference for the container registry to be able to pull images from it.')
param containerRegistryPassword string

@description('The image for the service.')
param containerImage string

//@secure()
//@description('The Application Insights Instrumentation.')
//param appInsightsInstrumentationKey string


@description('The target and dapr port for the service.')
param portNumber int

// ------------------
// RESOURCES
// ------------------

resource containerApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: containerName
  location: location
  tags: tags
//  identity: {
//    type: 'UserAssigned'
//    userAssignedIdentities: {
//        '${containerRegistryUserAssignedIdentityId}': {}
//    }
//  }
  properties: {
    managedEnvironmentId: containerAppsEnvironmentId
    configuration: {
      activeRevisionsMode: 'single'
      ingress: {
        external: true
        targetPort: portNumber
      }
//      dapr: {
//        enabled: true
//        appId: containerName
//        appProtocol: 'http'
//        appPort: portNumber
//        logLevel: 'info'
//        enableApiLogging: true
//      }
      secrets: [
        {
          name: 'ghcr-password'
          value: containerRegistryPassword
        }
      ]
      registries: !empty(containerRegistryName) ? [
        {
          server: containerRegistryName
          username: containerRegistryUsername
          passwordSecretRef: 'ghcr-password'
//          identity: containerRegistryUserAssignedIdentityId
        }
      ] : []
    }
    template: {
      containers: [
        {
          name: containerName
          image: containerImage
          resources: {
            cpu: json('0.25')
            memory: '0.5Gi'
          }
          env: [
//            {
//              name: 'ApplicationInsights__InstrumentationKey'
//              secretRef: 'appinsights-key'
//            }
          ]
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 1
      }
    }
  }
}

// ------------------
// OUTPUTS
// ------------------

@description('The name of the container app for the service.')
output containerAppName string = containerApp.name

@description('The FQDN of the service.')
output containerAppFQDN string = containerApp.properties.configuration.ingress.fqdn