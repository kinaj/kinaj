from datetime import datetime
from werkzeug.contrib.kickstart import Response
from couchdb.schema import Document, DateTimeField
from kinaj.models import Project
from kinaj.utils import expose
from kinaj.utils import render_html, render_xml
from kinaj.utils import url_for, datetimeTorfc822
from werkzeug import Response
from werkzeug import redirect


@expose('/')
def index(request):
    """docstring for index"""
    
    def wrap(doc):
        """docstring for wrap"""
        data = doc.value
        data['_id'] = doc.id
        return Project.wrap(data)
    
    if not request.is_xhr:
        featuredDocResults = Project.allFeatured()
        featuredResults = [wrap(doc) for doc in featuredDocResults]

        activeDocResults = Project.allActive()
        activeResults = [wrap(doc) for doc in activeDocResults]

        return render_html('index.html', active=reversed(activeResults),
                                featured=featuredResults)
                                
    else:
        if request.method == 'GET':
            activeDocResults = Project.allActive()
            activeResults = [wrap(doc) for doc in activeDocResults]
            
            l = []
            
            try:
                i = 0
                l.append(activeResults[i]._to_json(activeResults[i]))
                
                i = i + 1
            except i == len(activeResults), e:
                raise e
            
            return Response(l, mimetype='application/json')
            
        else:
            raise NotImplementedError('nothing here')


@expose('/projects/create')
def create(request):
    """docstring for new"""
    
    if request.method == 'POST':
        if not request.is_xhr:
            image_name = request.form.get('image_name')
            name = request.form.get('name')
            text = request.form.get('text')
            tags = request.form.get('tags')
            tags = tags.split(' ')
            active = bool(request.form.get('active'))
            featured = bool(request.form.get('featured'))

            project = Project(image_name=image_name,name=name,text=text
                                ,tags=tags,active=active,featured=featured)
            uid = project.create()

            return redirect('/projects/update/' + uid)
        
        else:
            resp = '''ok'''
            
            return Response(resp,mimetype='text/plain')
        
    elif request.method == 'GET':
        if not request.is_xhr:
            return render_html('projects/new.html')

        else:
            raise NotImplementedError('nothing here')

@expose('/projects/retrieve/<uid>')
def retrieve(request,uid):
    """return a single project"""
    doc = Project.retrieve(uid)[1]

    return render_html('projects/retrieve.html', doc=doc)


@expose('/projects/update/<uid>')
def update(request,uid):
    """docstring for update"""
    def wrap(doc):
        """docstring for wrap"""
        data = doc.value
        data['_id'] = doc.id
        return Project.wrap(data)
        
    if request.method == 'POST':
        if not request.is_xhr:
            doctype = 'project'
            docid = request.form.get('id')
            rev = request.form.get('rev')
            name = request.form.get('name')
            image_name = request.form.get('image_name')
            tags = request.form.get('tags')
            text = request.form.get('text')
            active = bool(request.form.get('active'))
            featured = bool(request.form.get('featured'))
            ctime = Project.retrieve(uid)[1]['ctime']
            
            dd = DateTimeField()
            mtime = datetime.now()
            mtime = dd._to_json(mtime)
            
            tags = tags.split(' ')

            d = Document(id=docid,rev=rev)

            d['_id'] = docid
            d['_rev'] = rev
            d['type'] = doctype
            d['name'] = name
            d['image_name'] = image_name
            d['tags'] = tags
            d['text'] = text
            d['active'] = active
            d['featured'] = featured
            d['ctime'] = ctime
            d['mtime'] = mtime

            Project.update(d)

            return redirect(url_for('update', uid=uid))
        
        else:
            
            resp = '''ok'''
            
            return Response(resp,mimetype='text/plain')
        
    elif request.method == 'GET':
        if not request.is_xhr:
            doc = Project.retrieve(uid)[1]
            doc["tags"] = " ".join(doc["tags"])

            return render_html('projects/update.html',doc=doc)
        
        else:
            raise NotImplementedError('nothing here')

@expose('/projects/delete/<uid>')
def delete(request,uid):
    """docstring for delete"""
    if not request.is_xhr:
        Project.delete(uid)
        return redirect(url_for('index'))
        
    else:
        if request.method == 'DELETE':
            Project.delete(uid)
            
            return Response('''ok''',mimetype='text/plain')
        
        else:
            raise NotImplementedError('nothing here')
    
@expose('/projects/feed/rss')
def rss(request):
    """Documentation"""

    def wrap(doc):
        """docstring for wrap"""
        data = doc.value
        data['_id'] = doc.id
        mtime = DateTimeField(datetime.now())
        mtime = mtime._to_python(data['mtime'])
        data['mtime'] = datetimeTorfc822(mtime)
        return Project.wrap(data)

    activeDocResults = Project.allActive()
    activeResults = [wrap(doc) for doc in activeDocResults]

    return render_xml('projects/rss2.xml', active=reversed(activeResults))


def not_found(request):
    """docstring for editor"""
    return render_html('not_found.html')
