# -*- coding: utf-8 -*-
from datetime import datetime

from simplecouchdb import schema


class Project(schema.Document):
    name = schema.StringProperty(name='name')
    text = schema.StringProperty(name='text')
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
    db = None
        