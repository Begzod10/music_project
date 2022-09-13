from flask import Flask, render_template, request, flash, redirect, url_for, send_from_directory, jsonify, send_file

from werkzeug.utils import secure_filename
import os
from tinytag import TinyTag
import eyed3
from eyed3.id3.frames import ImageFrame
import mutagen
from mutagen.easyid3 import EasyID3
from mutagen.id3 import ID3
import stagger
from flask_migrate import Migrate

from sqlalchemy import String, Integer, Boolean, Column, ForeignKey, DateTime, or_, and_, desc, func, ARRAY, JSON, \
    extract, Table
import time
from datetime import datetime
from backend.models import *
from backend.config import *

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'mp3'}

app = Flask(__name__)
app.secret_key = os.urandom(24)
app.config['DEBUG'] = True
app.config['SECRET_KEY'] = os.urandom(24)

app.config.from_object('backend.config')
db = db_setup(app)
migrate = Migrate(app, db)


@app.route('/')
def index():
    singers = Singer.query.order_by('id').all()
    return render_template('home.html', singers=singers)


def checkFile(filename):
    value = '.' in filename
    type_file = filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
    return value and type_file


@app.route('/singer_info/<int:singer_id>', methods=['GET'])
def singer_info(singer_id):
    albums = Album.query.filter_by(singer_id=singer_id).count()
    singer = Singer.query.filter_by(id=singer_id).first()
    all_musics = len(singer.musics)
    Singer.query.filter_by(id=singer_id).update({"albums_len": albums, "musics_len": all_musics})
    db.session.commit()
    singers = Singer.query.filter(Singer.id != singer_id).order_by('id').all()

    return render_template('singer_info.html', singer=singer, singers=singers)


@app.route('/download_mp3/<int:music_id>')
def download_mp3(music_id):
    music = Music.query.filter_by(id=music_id).first()

    return send_file(music.url, as_attachment=True)


@app.route('/cabinet', methods=['POST', 'GET'])
def cabinet():
    categories = Category.query.order_by('id').all()
    genres = Genre.query.order_by('id').all()
    singers = Singer.query.order_by('id').all()
    albums = Album.query.order_by('id').all()
    if request.method == 'POST':
        if 'music' not in request.files:
            return 'No file part'
        file = request.files['music']
        music_photo = request.files['music_photo']
        title = request.form['title']
        artist = request.form['artist']
        album = request.form['album']
        genre = request.form['genre']
        singer_id = request.form['singer_id']
        category_id = request.form['category_id']
        genre_id = request.form['genre_id']
        app.config['UPLOAD_FOLDER'] = music_folder_name()

        url = ""
        photo_url = ""
        if file and checkFile(file.filename):
            music_filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], music_filename))
            url = music_folder_name() + "/" + music_filename

        if music_photo and checkFile(music_photo.filename):
            photo_filename = secure_filename(music_photo.filename)
            photo_url = photo_folder_name() + "/" + photo_filename
            app.config['UPLOAD_FOLDER'] = photo_folder_name()
            music_photo.save(os.path.join(app.config['UPLOAD_FOLDER'], photo_filename))
        file_size = str(os.path.getsize(url) / (1024 * 1024))
        file_size = file_size[0:4] + " " 'mb'
        tag = TinyTag.get(url)
        duration = time.strftime("%M:%S", time.gmtime(tag.duration))
        bit_rate = str(tag.bitrate) + " " "kb/s"
        music = Music(name=title, url=url, file_size=file_size, duration=duration, bit_rate=bit_rate,
                      added_date=datetime.now())
        db.session.add(music)
        db.session.commit()
        if singer_id:
            singer_id = int(singer_id)
            singer = Singer.query.filter(Singer.id == singer_id).first()
            singer.musics.append(music)
            db.session.commit()

        if category_id:
            category_id = int(category_id)
            category = Category.query.filter(Category.id == category_id).first()
            category.musics.append(music)
            db.session.commit()
        if genre_id:
            genre_id = int(genre_id)
            genre_get = Genre.query.filter(Genre.id == genre_id).first()
            genre_get.musics.append(music)
            db.session.commit()
        if album:
            get_album = Album.query.filter_by(name=album).first()
            music.album.append(get_album)
            db.session.commit()
        try:
            meta = EasyID3(url)
        except mutagen.id3.ID3NoHeaderError:
            meta = mutagen.File(url, easy=True)
            meta.add_tags()

        meta['title'] = title
        meta['artist'] = artist
        meta['album'] = album
        meta['genre'] = genre
        meta.save(url, v1=2)
        #
        if url and photo_url:
            music_image_del = ID3(url)
            music_image_del.delall("APIC")
            music_image_del.save()
            audio_file = eyed3.load(url)

            audio_file.tag.images.set(ImageFrame.FRONT_COVER, open(photo_url, 'rb').read(),
                                      'image/jpeg')
            audio_file.tag.images.set(ImageFrame.BACK_COVER, open(photo_url, 'rb').read(),
                                      'image/jpeg')
            audio_file.tag.images.set(ImageFrame.BAND_LOGO, open(photo_url, 'rb').read(),
                                      'image/jpeg')
            audio_file.tag.images.set(ImageFrame.PUBLISHER_LOGO, open(photo_url, 'rb').read(),
                                      'image/jpeg')

            audio_file.tag.save()
            return redirect(url_for('cabinet'))

        else:
            return render_template('cabinet.html', error="Invalid type file!", categories=categories, albums=albums,
                                   genres=genres)

    return render_template('cabinet.html', categories=categories, genres=genres, singers=singers, albums=albums)


@app.route('/add_info/', methods=['POST'])
def add_info():
    body = {}
    jsons = request.get_json()
    singer_id = jsons['singer_id_chosen']
    add = ''
    if jsons['type'] == "category":
        add = Category(name=jsons['category'])
        add.save()
    elif jsons['type'] == "genre":
        add = Genre(name=jsons['category'])
        add.save()
    else:
        add = Album(name=jsons['category'], singer_id=int(singer_id))
        db.session.add(add)
        db.session.commit()
    body['category'] = jsons['category']
    body["id"] = add.id
    return jsonify(body)


@app.route('/add_singer', methods=['POST'])
def add_singer():
    name = request.form.get('name')
    singer_photo = request.files.get('singer_photo')
    if singer_photo and singer_photo.filename:
        photo_filename = secure_filename(singer_photo.filename)
        photo_url = singers_photo_folder() + "/" + photo_filename
        app.config['UPLOAD_FOLDER'] = singers_photo_folder()
        singer_photo.save(os.path.join(app.config['UPLOAD_FOLDER'], photo_filename))
        add = Singer(name=name, photo=photo_url)
        db.session.add(add)
        db.session.commit()
    else:
        add = Singer(name=name)
        db.session.add(add)
        db.session.commit()
    return redirect(url_for('cabinet'))


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'],
                               filename)


@app.route('/get_albums', methods=['POST'])
def get_albums():
    body = {}
    body['names'] = []
    body['id'] = []
    singer_id = int(request.get_json()['singer_id'])
    albums = Album.query.filter_by(singer_id=singer_id).all()
    for album in albums:
        body['names'].append(album.name)
        body['id'].append(album.id)

    return jsonify(body)


# delete music from directory
# file = "musics/Jesper_Kyd_-_Ezios_Family_musmore.com.mp3"
# os.remove(file)


# get data of music in tinytag module
tag = TinyTag.get('static/musics/Jesper_Kyd_-_Ezios_Family_musmore.com_1.mp3')
# print('This track is by %s.' % tag.artist)
# song_duration = tag.duration
# print('It is %f seconds long.' % tag.duration)
# print('Title: ' + tag.title)
# print('file size ', tag.filesize)


# file temp watch video
# print('music', tag.audio_offset)


# get size of file in mb

# convert seconds to minute
# duration = time.strftime("%M:%S", time.gmtime(song_duration))
# print(duration)

# print(mp3.picture)


# from PIL import Image
# import io
#
# mp3 = stagger.read_tag('static/musics/Jesper_Kyd_-_Ezios_Family_musmore.com.mp3')
# by_data = mp3[stagger.id3.APIC][0].data
# im = io.BytesIO(by_data)
# imageFile = Image.open(im)
# print(Image)


if __name__ == "__main__":
    app.run()
