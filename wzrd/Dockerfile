FROM python:3.8-buster

WORKDIR /app
COPY requirements.txt requirements.txt

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY wzrd /app/wzrd
COPY manage.py /app

CMD ["python3", "./manage.py", "runserver", "0.0.0.0:8000"]