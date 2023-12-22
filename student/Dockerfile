FROM python:3.9.18-slim

WORKDIR /app
COPY . .

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

EXPOSE 5001

# Command to run the application
CMD ["python", "student.py"]
