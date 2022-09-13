from sqlalchemy import String, Integer, Boolean, Column, ForeignKey, DateTime, or_, and_, desc, func, ARRAY, JSON, \
    extract, Table, engine
from sqlalchemy.orm import relationship
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()


def db_setup(app):
    app.config.from_object('backend.config')
    db.app = app
    db.init_app(app)
    migrate = Migrate(app, db)
    return db


music_album = db.Table('music_album',
                       Column('music_id', Integer, ForeignKey('music.id')),
                       Column('album_id', Integer, ForeignKey('album.id'))
                       )

music_genre = db.Table('music_genre',
                       Column('music_id', Integer, ForeignKey('music.id')),
                       Column('genre_id', Integer, ForeignKey('genre.id'))
                       )
music_category = db.Table('music_category',
                          Column('music_id', Integer, ForeignKey('music.id')),
                          Column('category_id', Integer, ForeignKey('category.id'))
                          )

music_singer = db.Table('music_singer',
                        Column('music_id', Integer, ForeignKey('music.id')),
                        Column('singer_id', Integer, ForeignKey('singer.id'))
                        )


class Music(db.Model):
    id = Column(Integer, primary_key=True)
    name = Column(String)
    url = Column(String)
    file_size = Column(String)
    duration = Column(String)
    bit_rate = Column(String)
    album = relationship('Album', secondary="music_album", backref="musics")
    genre = relationship('Genre', secondary="music_genre", backref="musics")
    singer = relationship('Singer', secondary="music_singer", backref="musics")
    category = relationship("Category", secondary="music_category", backref="musics")
    added_date = Column(DateTime)

class Album(db.Model):
    id = Column(Integer, primary_key=True)
    name = Column(String)
    singer_id = Column(Integer, ForeignKey("singer.id"))


class Category(db.Model):
    id = Column(Integer, primary_key=True)
    name = Column(String)

    def save(self):
        db.session.add(self)
        db.session.commit()


class Genre(db.Model):
    id = Column(Integer, primary_key=True)
    name = Column(String)

    def save(self):
        db.session.add(self)
        db.session.commit()


class Singer(db.Model):
    id = Column(Integer, primary_key=True)
    name = Column(String)
    photo = Column(String)
    albums_len = Column(Integer)
    musics_len = Column(Integer)
    album = db.relationship('Album', backref="singer", order_by="Album.id")
