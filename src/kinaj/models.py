# -*- coding: utf-8 -*-
from datetime import datetime

from simplecouchdb import schema


class Project(schema.Document):
    preview_small = schema.StringProperty(name='preview_small')
    preview_big = schema.StringProperty(name='preview_big')
    name = schema.StringProperty(name='name')
    type = schema.StringProperty(name='type', default='project')
    tags = schema.ListProperty(name='tags')
    text = schema.StringProperty(name='text')
    active = schema.BooleanProperty(name='active', default=False)
    featured = schema.BooleanProperty(name='featured', default=False)
    ctime = schema.DateTimeProperty(name='ctime', auto_now_add=True)
    mtime = schema.DateTimeProperty(name='mtime', auto_now=True)
    
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
        return self.db.post(doc)
    
    @classmethod    
    def delete(self, docid):
        doc = self.db.get(docid)
        
        return self.db.delete(doc)
    
    def __repr__(self):
        return '<PROJECT %s>' % self.name
        
        
class User(schema.Document):
    """docstring for User"""
    db = None
        