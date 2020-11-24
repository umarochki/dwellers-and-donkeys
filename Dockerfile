FROM python:3.8-buster

WORKDIR /app
COPY wzrd/requirements.txt requirements.txt

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY wzrd/wzrd /app/wzrd
COPY wzrd/manage.py /app

CMD ["python3", "./manage.py", "runserver", "0.0.0.0:8000"]