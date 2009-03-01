# -*- coding: utf-8 -*-
import hashlib, random
from datetime import datetime
from random import sample, randrange

from simplecouchdb import schema

URL_CHARS = 'abcdefghijkmpqrstuvwxyzABCDEFGHIJKLMNPQRST23456789'

class Project(schema.Document):
    name = schema.StringProperty(name='name')
    text = schema.StringProperty(name='text')
    markup = schema.StringProperty(name='markup', default='markdown')
    category = schema.StringProperty(name='category')
    tags = schema.ListProperty(name='tags')
    active = schema.BooleanProperty(name='active', default=False)
    featured = schema.BooleanProperty(name='featured', default=False)
    ctime = schema.DateTimeProperty(name='ctime', auto_now_add=True)
    mtime = schema.DateTimeProperty(name='mtime', auto_now=True)
    
    preview_small = schema.StringProperty(name='preview_small')
    preview_big = schema.StringProperty(name='preview_big')
    download_mac = schema.StringProperty(name='download_mac')
    download_pc = schema.StringProperty(name='download_pc')
    
    db = None
    
    def __unicode__(self):
        """docstring for __unicode__"""
        return self.text
        
        
    @classmethod
    def all(self):
        return self.db.view('projects/all')
    
    @classmethod    
    def allActive(self):
        return self.db.view('projects/allActive')
    
    @classmethod    
    def allActiveNotFeatured(self):
        return self.db.view('projects/allActiveNotFeatured')
    
    @classmethod    
    def allFeatured(self):
        return self.db.view('projects/allFeatured')

    @classmethod
    def create(self, doc):
        """docstring for create"""
        return doc.save(self.db)
    
    @classmethod    
    def retrieve(self, docid):
        return self.db.get(docid)
    
    @classmethod    
    def update(self, doc):
        return self.db.save(doc)
    
    @classmethod    
    def delete(self, docid):
        doc = self.db.get(docid)
        
        return self.db.delete(doc)
    
    def __repr__(self):
        return '<PROJECT %s>' % self.name
        
        
class User(schema.Document):
    """docstring for User"""
    password = schema.StringProperty(name='password')
    roles = schema.ListProperty(name='roles')
    session = schema.DictProperty(name='session')
    
    db = None
    
    @classmethod
    def update(self, doc):
        return self.db.save(doc)
    
    
    @classmethod
    def valid_user(self, username, password):
        """docstring for valid_user"""
        user = User.db.get(username)
        
        if user['password'] == password:
            return True
            
        return False
        
        
    @classmethod
    def user_roles(self, username):
        user = User.db.get(username)
        
        return user['roles']
    
    
    @staticmethod
    def pwdhash(password, algo='sha512', salt=None):
        salt = salt or hashlib.new(algo, str(random.random())).hexdigest()[:5]
        hpwd = hashlib.new(algo, ''.join((salt, password))).hexdigest()

        return '$'.join((algo, salt, hpwd))

   
    @classmethod
    def chkpwd(self, password, reference):
        algo, salt, _ = reference.split('$')

        return (User.pwdhash(password, algo, salt) == reference)


class Up(schema.Document):
    """docstring for Up"""
    sid = schema.StringProperty(name='sid')
    
    db = None
    
    @classmethod
    def create(self, content, name=None, content_type=None):
        """docstring for create"""
        uid = ''.join(sample(URL_CHARS, randrange(3, 9)))
        
        tdoc = Up(id=uid, sid=uid)
        
        tdoc.save(self.db)
        
        doc = self.db.get(uid)
        
        self.db.put_attachment(doc, content, name, content_type)
        
        return uid
        
    @classmethod
    def retrieve(self, docid):
        """docstring for retrieve"""
        attachments = self.db.get(docid)['_attachments']
        for attachment in attachments:
            f = {
                "content_type": attachments[attachment]['content_type'],
                "file": self.db.fetch_attachment(docid, attachment)
            }
            
        return f;
        