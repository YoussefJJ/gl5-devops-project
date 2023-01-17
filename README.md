# Introduction
This is an academic project that consists of implementing an infrastructure using DevOps tools that encapsulates three different concepts:

1. Deployment
2. Automation
3. Observability

# Microservices
The application is a Twitter clone API, made with Express, that allows to send tweets and retweet an existing tweet.
The application is composed of 2 microservices: An authentication service and a tweet service, each interrogating and storing data inside a PostgreSQL database.

// insert microservices photo

# Deployment
## Infrastructure
Each service infrastructure is composed of Service that allows communication inside the cluster with each a deployment that controls the lifecycle of the pods. To configure each service, we pass parameters as environment variables such as the ports, service names and observability endpoints for
Tracing and Logging.
I packaged the application in a Helm Chart and deployed it in a remote repository. 

You can find more information about the helm chart [here](./chart/).

// insert infrastructure photo

## Deployment Strategy
Currently, I have not implemented a deployment strategy due to time constraints. However, there is an idea in mind. As this is a Twitter API, you can add more features and try to test it to specifc set of communities and see how it works out. That's why I thought of A/B testing while adding a functionality of liking a tweet and study the user feedback and system performance. 

# Automation
To automate the deployment of the application inside an Azure Kubernetes Cluster, I chose to use Terraform to install resources in the cluster and manage the interconnected systems within it. I decided to create stacks for the steps needed to run the application with its internal and external functionalities. The stacks are as follows:
1. Azure Kubernetes Cluster Provisioning
2. Database Initialization
3. Application Deployment (microservices and ingress controller)
4. Observability tools Deployment

More informations can be found about the stacks [here](./terraform/)

//insert microstacks photo

# Observability
In this part, we test how our systems works by observing what the services expose such as metrics, logs and traces.

## 1 - Metrics
I used Prometheus to collect metrics from Node JS apps with the use of Prometheus Client that helps you to get metrics from the endpoint `/metrics` then we can use Grafana to visualize the metrics stream in real-time a time series database.

// insert metrics image

### Business Logic Metric
In the case of Twitter it is highly effective to see the Tweet posting rate for each user. That way we can get an overview vision about user consumption and how they use the platform.

// insert grafana image

## 2 - Logs
I implemented a logging functionality using Winston which is a Library for NodeJS that is widely used for creating structured logs in different formats(such as file, console or even sending logs through HTTP).
For log collection, DataDog was the primary choice as it allowed an intuitive User Interface and setting the agent was fairly simple as it was packaged in a Helm Chart with basic configuration.

// insert datadog log UI

## 3 - Traces
By far the most challenging task, it required setting up a tracing process and an Exported inside our NodeJS applications. At first, I opted to use Jaeger for tracing collection and although it was able to do so locally, I was unable to deploy it to the cluster and access the traces data from there. By Consequence, I opted for DataDog as it was natively adapted for such task and the agent was aleady deployed for log collection. It just required an additional configuration and I was good to go.

// insert datadog traces UI