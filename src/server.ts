import { app } from './app';

const port: number | string = process.env.PORT || 4000;

// Handle uncaught exceptions
process.on('uncaughtException', error => {
  console.error('Uncaught Exception:', error.message);
  // You may want to perform cleanup or logging here
  process.exit(1); // Exit the process with a non-zero code
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  console.error('Unhandled promise:', promise);
  // You may want to perform cleanup or logging here
  // By default, Node.js will terminate the process on unhandled promise rejections
  // But you can add custom handling if needed
});

app.listen(port, (): void => console.log(`Server started on port ${port}`));
