import os

SECRET_KEY = os.urandom(32)
# Grabs the folder where the script runs.
basedir = os.path.abspath(os.path.dirname(__file__))

DEBUG = True

SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:123@localhost:5432/music-world'
SQLALCHEMY_TRACK_MODIFICATIONS = False


def music_folder_name():
    upload_folder = 'static/musics'
    return upload_folder


def photo_folder_name():
    upload_folder = 'static/img/music_logo'
    return upload_folder


def singers_photo_folder():
    upload_folder = 'static/img/singers'
    return upload_folder
