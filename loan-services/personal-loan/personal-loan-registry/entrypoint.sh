#!/bin/sh
# entrypoint.sh

echo "Waiting for Eureka to start..."

# Start a loop that will continue until a connection can be established to Eureka on port 8761
while ! nc -z eureka-server 8761; do
  # If a connection cannot be established, sleep for 1 second before checking again
  sleep 1
done

# Once a connection can be established, print a message to the console indicating that Eureka has started
echo "Eureka started"
exec "$@"