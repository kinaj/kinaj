import hashlib, random, re, uuid, time

import simplecouchdb


class CouchDBSessionStore(object):
    """Session store that saves sessions as entry in a CouchDB document."""
    _sid_match = re.compile('^[0-9a-f]{32}$').match
    
    def __init__(self, dbname, property_name=None):
        self._db = simplecouchdb.Server().get_db(dbname)
        self._property_name = property_name or 'session'
        
        
    def is_valid_sid(self, key):
        """Check sid format."""
        return bool(self._sid_match(key))
        
        
    def create(self, doc):
        ctime = time.time()
        sid = uuid.uuid4().hex
        doc['session'] = { 'id': sid, 'data': {}
                         , 'ctime': ctime, 'mtime': ctime}
        self.db.save(doc)
        
        return sid
    
    
    def retrieve(self, sid):
        sessions = self.db.view('session/session', key=sid)
        session = (tuple(sessions)[0]['value'] if sessions else {})
        
        return session
        
        
    def update(self, session):
        parent = session.pop('parent')
        doc = self.db.get(parent)
        doc['session'] = session
        self.db.save(doc)
        

    def delete(self, session):
        parent = session.pop('parent')
        doc = self.db.get(user)
        doc.pop('session')
        self.db.save(doc)
        