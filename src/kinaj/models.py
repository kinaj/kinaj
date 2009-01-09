# -*- coding: utf-8 -*-
from datetime import datetime

# from couchdb.schema import Document, ListField, TextField, BooleanField, DateTimeField

from simplecouchdb import schema


class Project(schema.Document):
    preview_small = schema.StringProperty(name='preview_small')
    preview_big = schema.StringProperty(name='preview_big')
    name = schema.StringProperty(name='name')
    slug = schema.StringProperty(name='slug')
    type = schema.StringProperty(name='type',default='project')
    tags = schema.ListProperty(name='tags')
    text = schema.StringProperty(name='text')
    active = schema.BooleanProperty(name='active',default=False)
    featured = schema.BooleanProperty(name='featured',default=False)
    ctime = schema.DateTimeProperty(name='ctime',auto_now_add=True)
    mtime = schema.DateTimeProperty(name='mtime',auto_now=True)
    
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
        return self.db.save(doc)
    
    @classmethod    
    def retrieve(self,slug):
        # return self.db.resource.get(uid)
        
        map_fun = '''function(doc) {
            if (doc.type === "project" && doc.active && doc.slug === "%s") {
                emit(doc.mtime, doc);
            }
        }''' % slug
        
        print self.db.get('_view/projects/retrieve/?slug=%s' % slug)
        # return self.db.view(map_fun)
    
    @classmethod    
    def update(self,doc):
        return self.db.save(doc)
    
    @classmethod    
    def delete(self,uid):
        doc = self.db.get(uid)
        
        return self.db.delete(doc)
    
    def __repr__(self):
        return '<PROJECT %s>' % self.name