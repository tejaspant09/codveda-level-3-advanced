# Django authentication demo — alternate Level 3 Task 1 interpretation

The Codveda PDF's Level 3 Task 1 title/objectives describe a React component library with Storybook; its longer description instead asks for Django authentication. The existing component-library directory satisfies the title/objectives. This separate app covers the conflicting Django interpretation as additional evidence. **Codveda has not confirmed which interpretation they expect.**

## Features

- Registration and login using Django's built-in user and authentication forms.
- Password validators, hashed passwords, session authentication, CSRF-protected forms, and a login-protected dashboard.
- POST-only sign-out.
- Django password-reset flow. During local development, reset email content is printed to the server terminal.
- Responsive page styling, keyboard focus states, visible field errors, and automated security-flow tests.

## Run on Windows

Requires Python 3.12 or newer. Tested with Python 3.13.

~~~powershell
cd level-3/django-auth-demo
py -3.13 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe manage.py migrate
.\.venv\Scripts\python.exe manage.py test
.\.venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000
~~~

Open http://127.0.0.1:8000/. Use a demo-only password. The local database is db.sqlite3, which is ignored by Git.

## Production boundary

This is a local learning demo, not a production account service. It uses SQLite and a console email backend during development. It has no email verification or login throttling. Do not publish it with DEBUG enabled or the development database. Production use requires a secret DJANGO_SECRET_KEY, a specific DJANGO_ALLOWED_HOSTS list, HTTPS, a supported production database, configured email delivery and throttling, deployment review, and Django's deployment checklist. The frontend Sites preview is static and does not run this Django server.

## Task interpretation and originality

Keep the React component library as the primary Level 3 Task 1 deliverable because it matches the title and objectives. Show this Django app as an explicitly labeled supplemental interpretation until Codveda answers the conflict. This code was prepared with AI assistance; understand it, make your own changes, and describe your contribution honestly.

## Verification

~~~powershell
.\.venv\Scripts\python.exe manage.py check
.\.venv\Scripts\python.exe manage.py test
~~~
