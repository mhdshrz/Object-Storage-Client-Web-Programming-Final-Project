# File Storage Web Application

This project is a web application that allows users to securely upload, manage, and share files using ArvanCloud's object storage. Users can register for an account, log in, and utilize the platform's features for file management. The application supports file uploads, downloads, deletions, and sharing capabilities. 

## Features

- **User Registration and Authentication**: Users can sign up for an account or log in to access their files.
- **File Upload**: Users can upload files to ArvanCloud's object storage through the application.
- **File Management**: Users can view their uploaded files with pagination, and they can delete files they have uploaded.
- **File Sharing**: Users can share access to their files with other users. The shared users can view and download the files but cannot modify or delete them.
- **Pagination**: Files are displayed with pagination controls, allowing users to navigate through pages using arrows and page numbers.

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (for user management and file metadata)
- **Object Storage**: ArvanCloud Object Storage
- **Authentication**: JWT (JSON Web Token) for secure user sessions

## Setup and Installation

1. **Clone the repository**
    ```bash
    git clone https://github.com/your-username/file-storage-webapp.git
    cd file-storage-webapp
    ```

2. **Install dependencies**
    ```bash
    npm install
    ```

3. **Configure environment variables**

    Create a `.env` file in the root directory with the following variables:

    ```
    PORT=3000
    MONGODB_URI=your_mongodb_uri
    ARVANCLOUD_ACCESS_KEY=your_arvancloud_access_key
    ARVANCLOUD_SECRET_KEY=your_arvancloud_secret_key
    JWT_SECRET=your_jwt_secret
    ```

4. **Start the application**
    ```bash
    npm start
    ```

5. **Access the application**

    Open your browser and go to `http://localhost:3000`.

## Usage

1. **Register an Account**: Sign up for an account to start using the service.
2. **Upload Files**: After logging in, use the upload interface to add files to your account.
3. **Manage Files**: View your files in the dashboard, delete files you no longer need, and share files with other users.
4. **File Sharing**: Share access to your files with other registered users by providing their email address.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Contributions

Contributions are welcome! Please submit a pull request or open an issue for any changes or enhancements you would like to see.

## Contact

For any inquiries or support, please contact `your-email@example.com`.
