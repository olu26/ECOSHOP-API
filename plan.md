# Comprehensive Plan for Implementing Admin Management and OTP Functionality

## Plan:

1. **In `controllers/userController.js`**:
   - **Add Admin Functions**:
     - Create a function `getAllUsers` to retrieve a list of all users for admin management.
     - Create a function `deleteUser` to allow the admin to delete a user by their ID.
     - Create a function `updateUserRole` to allow the admin to update a user's role (promote/demote).

   - **Add OTP Functionality**:
     - Create a function `forgotPassword` to generate and send an OTP to the user's email for password recovery.
     - Create a function `verifyOtp` to verify the OTP entered by the user.

2. **In `routes/userRoutes.js`**:
   - **Add Admin Routes**:
     - Add a route `GET /api/users` to get all users, protected by the admin middleware.
     - Add a route `DELETE /api/users/:id` to delete a user, protected by the admin middleware.
     - Add a route `PUT /api/users/:id` to update a user's role, protected by the admin middleware.

   - **Add OTP Routes**:
     - Add a route `POST /api/users/forgot-password` to request an OTP for password recovery.
     - Add a route `POST /api/users/verify-otp` to verify the OTP.

3. **In `models/userModel.js`**:
   - Ensure the existing fields `resetPasswordToken` and `resetPasswordExpire` are utilized in the new functions for OTP functionality.

4. **In `middleware/authMiddleware.js`**:
   - No changes needed, as the existing middleware already supports admin checks.

## Follow-up Steps:
- Implement the changes in the respective files.
- Test the new functionalities to ensure they work as expected.
