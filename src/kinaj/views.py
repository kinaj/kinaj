# -*- coding: utf-8 -*-
import simplejson

from datetime import datetime

from couchdb.schema import Document, DateTimeField

from kinaj.models import Project
from kinaj.utils import expose, render_html, render_xml, render_atom, url_for
from kinaj.utils import wrap

from werkzeug import Response, redirect


@expose('/')
def index(request):

    if not request.is_xhr:
        featured = [wrap(doc) for doc in Project.allFeatured()][0]
        activeResults = [wrap(doc) for doc in Project.allActiveNotFeatured()]
        
        template_values = {
            'featured': featured,
            'active': reversed(activeResults)
        }
        
        return render_html('index.html', template_values)
                                
    else:
        raise NotImplementedError('nothing here')


@expose('/projects/')
def list(request):

    if not request.is_xhr:
        activeResults = [wrap(doc) for doc in Project.allActive()]
        
        template_values = {
            'active':reversed(activeResults)
        }
        
        return render_html('/projects/list.html', template_values)
    else:
        raise NotImplementedError('nothing here')


@expose('/projects/create/')
def create(request):
    if not request.is_xhr:
        if request.method == 'POST':
            p = {
                'preview_small': request.form.get('preview_small'),
                'preview_big': request.form.get('preview_big'),
                'name': request.form.get('name'),
                'slug': request.form.get('slug'),
                'text': request.form.get('text'),
                'tags': request.form.get('tags'),
                'active': bool(request.form.get('active')),
                'featured': bool(request.form.get('featured')),
            }

            p['tags'] = p['tags'].split(' ')

            resp = Project.create(p)

            return redirect('/projects/update/%s' % resp['_id'])
        
        elif request.method == 'GET':
            
            return render_html('projects/create.html', {})
        
    else:
        raise NotImplementedError('nothing here')

@expose('/projects/retrieve/<slug>/')
def retrieve(request,slug):
    if request.method == 'POST':
        raise NotImplementedError('nothing here')
    
    elif request.method == 'GET':
        doc = Project.retrieve(slug)
        print doc
        
        if not request.is_xhr:
            project = [wrap(doc) for doc in docResults][0]
            return render_html('projects/retrieve.html', project=project)
            
        else:
            project = docResults.rows[0].value
            
            foo = simplejson.JSONEncoder()
            
            resp = foo.encode({
                '_id':project['_id'],
                '_rev':project['_rev'],
                '_attachments':project['_attachments'],
                'name':project['name'],
                'text':project['text'],
                'slug':project['slug'],
                'tags':project['tags'],
                'preview_big':project['preview_big'],
                'preview_small':project['preview_small'],
            })
            
            return Response(resp,mimetype='application/json')


@expose('/projects/update/<uid>/')
def update(request,uid):
    if request.method == 'POST':
        if not request.is_xhr:
            d = Project.db.get(uid)
            
            d['name'] = request.form.get('name')
            d['slug'] = request.form.get('slug')
            d['preview_small'] = request.form.get('preview_small')
            d['preview_big'] = request.form.get('preview_big')
            d['tags'] = request.form.get('tags')
            d['text'] = request.form.get('text')
            d['active'] = bool(request.form.get('active'))
            d['featured'] = bool(request.form.get('featured'))

            d['tags'] = d['tags'].split(' ')

            print d

            Project.update(d)

            return redirect(url_for('update', uid=uid))
        
        else:
            
            resp = '''ok'''
            
            return Response(resp,mimetype='text/plain')
        
    elif request.method == 'GET':
        if not request.is_xhr:
            doc = Project.db.get(uid)
            doc["tags"] = " ".join(doc["tags"])

            template_values = {
                'doc':doc 
            }

            return render_html('projects/update.html',template_values)
        
        else:
            raise NotImplementedError('nothing here')


@expose('/projects/delete/<uid>/')
def delete(request,uid):
    if not request.is_xhr:
        Project.delete(uid)
        return redirect(url_for('index'))
        
    else:
        if request.method == 'DELETE':
            Project.delete(uid)
            
            return Response('''ok''',mimetype='text/plain')
        
        else:
            raise NotImplementedError('nothing here')

    
@expose('/projects/feed/rss/')
def rss(request):
    activeDocResults = Project.allActive()
    activeResults = [wrap(doc) for doc in activeDocResults]

    now = datetimeTorfc822(datetime.now())

    return render_xml('projects/rss2.xml', active=reversed(activeResults),now=now)


@expose('/projects/feed/atom/')
def atom(request):
    activeDocResults = Project.allActive()
    activeResults = [wrap(doc) for doc in activeDocResults]
    
    return render_atom('projects/atom.xml', active=reversed(activeResults),now=now)
    

def not_found(request):
    return render_html('not_found.html')
