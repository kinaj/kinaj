from datetime import datetime

from couchdb.schema import Document, ListField, TextField, BooleanField, DateTimeField



class Project(Document):
    preview_small = TextField()
    preview_big = TextField()
    name = TextField()
    slug = TextField()
    type = TextField(default='project')
    tags = ListField(TextField())
    text = TextField()
    active = BooleanField(default=False)
    featured = BooleanField(default=False)
    ctime = DateTimeField(default=datetime.now())
    mtime = DateTimeField(default=datetime.now())
    
    db = None
    
    @classmethod
    def all(self):
        return self.db.view('projects/all')
    
    @classmethod    
    def allActive(self):
        return self.db.view('projects/allActive')
    
    @classmethod    
    def allFeatured(self):
        return self.db.view('projects/allFeatured')
    
    @classmethod    
    def retrieve(self,slug):
        # return self.db.resource.get(uid)
        
        map_fun = '''function(doc) {
            if (doc.type === "project" && doc.active && doc.slug === "'''+ slug +'''") {
                emit(doc.mtime, doc);
            }
        }''' 
          
        print map_fun  
        
        return self.db.query(map_fun)
    
    @classmethod    
    def update(self,doc):
        return self.db.update([doc])
    
    @classmethod    
    def delete(self,uid):
        doc = self.db.get(uid)
        
        return self.db.delete(doc)
    
    def create(self):
        """docstring for create"""
        return Project.db.create(self._data)
    
    def __repr__(self):
        return '<PROJECT %r>' % self.id 