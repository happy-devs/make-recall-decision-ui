# Making a Recall Decision UI (`make-recall-decision-ui`)

[![repo standards badge](https://img.shields.io/badge/dynamic/json?color=blue&style=for-the-badge&logo=github&label=MoJ%20Compliant&query=%24.data%5B%3F%28%40.name%20%3D%3D%20%22make-recall-decision-ui%22%29%5D.status&url=https%3A%2F%2Foperations-engineering-reports.cloud-platform.service.justice.gov.uk%2Fgithub_repositories)](https://operations-engineering-reports.cloud-platform.service.justice.gov.uk/github_repositories#make-recall-decision-ui)
[![CircleCI](https://circleci.com/gh/ministryofjustice/make-recall-decision-ui/tree/main.svg?style=svg)](https://circleci.com/gh/ministryofjustice/make-recall-decision-ui)

TODO: Describe project

## Dependencies

The app requires:

- hmpps-auth - for authentication
- redis - session store and token caching
- make-recall-decision-api - main API for the app

## Setup
Install dependencies using `npm install`, ensuring you are using >= `Node v16.x`

Copy the .env.sample file in the root of this repo and name the copy as .env, then complete with the missing env values (the team will provide them).

## Running the app for local development

To start the main services excluding the UI:

```
./scripts/start-services-no-ui.sh
```

And then, to start the app:

```
npm run start:dev
```

## Automated tests and linting
[Doc](./docs/lint-tests.md)

## E2E Tests on CircleCI

The E2E tests are ran against the `dev` and `preprod` environments after deployment. The user credentials they use to log into the service are stored as [environment variables (in CircleCI)](https://app.circleci.com/settings/project/github/ministryofjustice/make-recall-decision-ui/environment-variables) called `CYPRESS_USERNAME_<environment>` and `CYPRESS_PASSWORD_<environment>`.

## Dependency Checks

The template project has implemented some scheduled checks to ensure that key dependencies are kept up to date.
If these are not desired in the cloned project, remove references to `check_outdated` job from `.circleci/config.yml`
