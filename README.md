# Authress Starter Kit: Vue

A repository that contains an Vue example that uses Authress to Login.

## Getting Started

Run `yarn` and then `yarn start`. Or use pnpm to install dependencies and then `start` the site.

### File Directory

* `src`
  * `main.ts` - Application Root and contains all the routes of the starter kit application
  * `authressClient.ts` - Configuration for Authress for users to login
  * `routes`
    * `home.ts` - Landing page which has login and logout buttons
    * `protected.ts` - Page protected by user login via the login guard defined in the `main.ts` file


## Demo Instructions

* `yarn`
* `yarn start`

There is a demo experience that has a UI and an service API. The UI makes API calls to the service. We can see the data rendered in the view.

### Starting
* All data is public, users can log in and see their icon displayed.
* The API is running and the UI can make these calls, but they are unauthenticated.

### Add Login verification
* Add a middleware to get the token and verify it

```js server.ts
app.use(authressTokenValidation);
```

* Demo that the UI doesn't work anymore because the user isn't logged in.
* Add a guard in the UI that requires the user to log in.

```js main.ts
await ensureUserIsLoggedIn(next);
```

* Then they log in

### Add authorization
* Navigate to a specific resource
* We'll add a check to the service code which ensures that a user has the right permission to the resource

```js reportsController.ts
const result = await authressPermissionsWrapper.hasAccessToResource(userId, '/reports', 'Reports:Get');
  if (!result) {
    return forbidden(response);
  }
```

* Then we'll see that they don't
* Then go to Authress and configure:
  * A new role
  * Add the role to the access record for the resource
* Go back to the UI to display the list which now only has one element