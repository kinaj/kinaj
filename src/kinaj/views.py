# -*- coding: utf-8 -*-
import simplejson

from datetime import datetime

from kinaj.models import Project
from kinaj.utils import expose, render_html, render_xml, render_atom, url_for
from kinaj.utils import wrap, make_id

from werkzeug import Response, redirect


@expose('/')
def index(request):

    if not request.is_xhr:
        featured = [wrap(project) for project in Project.allFeatured()][0]
        activeResults = [wrap(project) for project in Project.allActiveNotFeatured()]
        
        context = {
            'featured': featured,
            'active': reversed(activeResults)
        }
        
        return render_html('index.html', context)
                                
    else:
        raise NotImplementedError('nothing here')


@expose('/projects/list/')
def list(request):

    if not request.is_xhr:
        activeResults = [wrap(project) for project in Project.allActive()]
        
        context = {
            'active':reversed(activeResults)
        }
        
        return render_html('/projects/list.html', context)
    else:
        raise NotImplementedError('nothing here')


@expose('/projects/create/')
def create(request):
    if not request.is_xhr:
        if request.method == 'POST':
            p = Project()
            p['id'] = make_id(request.form.get('name'))
            p['preview_small'] = request.form.get('preview_small')
            p['preview_big'] = request.form.get('preview_big')
            p['name'] = request.form.get('name')
            p['text'] = request.form.get('text')
            p['tags'] = request.form.get('tags').split(' ')
            p['active'] = bool(request.form.get('active'))
            p['featured'] = bool(request.form.get('featured'))
            
            resp = Project.create(p)

            return redirect(url_for('update', docid=p['id']))
        
        elif request.method == 'GET':
            
            return render_html('projects/create.html')
        
    else:
        raise NotImplementedError('nothing here')

@expose('/projects/retrieve/<path:docid>/')
def retrieve(request, docid):
    if request.method == 'POST':
        raise NotImplementedError('nothing here')
    
    elif request.method == 'GET':
        project = Project.retrieve(docid)
        
        if not request.is_xhr:
            context = {
                "project": project,
            }
            
            return render_html('projects/retrieve.html',context)
            
        else:
            resp = simplejson.dumps(project)
            
            return Response(resp, mimetype='application/json')


@expose('/projects/update/<path:docid>/')
def update(request,docid):
    if request.method == 'POST':
        if not request.is_xhr:
            d = Project.db.get(docid)
            
            d['name'] = request.form.get('name')
            d['preview_small'] = request.form.get('preview_small')
            d['preview_big'] = request.form.get('preview_big')
            d['tags'] = request.form.get('tags')
            d['text'] = request.form.get('text')
            d['active'] = bool(request.form.get('active'))
            d['featured'] = bool(request.form.get('featured'))

            d['tags'] = d['tags'].split(' ')

            Project.update(d)

            return redirect(url_for('update', docid=docid))
        
        else:
            
            resp = '''ok'''
            
            return Response(resp,mimetype='text/plain')
        
    elif request.method == 'GET':
        if not request.is_xhr:
            project = Project.db.get(docid)
            project["tags"] = " ".join(project["tags"])

            context = {
                'project':project 
            }

            return render_html('projects/update.html',context)
        
        else:
            raise NotImplementedError('nothing here')


@expose('/projects/delete/<path:docid>/')
def delete(request,docid):
    if not request.is_xhr:
        Project.delete(docid)
        return redirect(url_for('index'))
        
    else:
        if request.method == 'DELETE':
            Project.delete(docid)
            
            return Response('''ok''',mimetype='text/plain')
        
        else:
            raise NotImplementedError('nothing here')

    
@expose('/projects/feed/rss/')
def rss(request):
    activeDocResults = Project.allActive()
    activeResults = [wrap(project) for project in activeDocResults]
    
    context = {
        'active': reversed(activeResults)
    }
    
    return render_xml('projects/rss2.xml', context)


@expose('/projects/feed/atom/')
def atom(request):
    activeDocResults = Project.allActive()
    activeResults = [wrap(project) for project in activeDocResults]
    
    context = {
        'active': reversed(activeResults)
    }
    
    return render_atom('projects/atom.xml', context)
    
    
@expose('/static/projects/<path:path>')
def attachment(request, path):
    """docstring for attachments"""
    if request.method == 'GET':
        return redirect('http://localhost:5984/kinaj-projects/%s' % path)
    else:
        raise NotImplementedError('Should be ACCESS DENIED')

def not_found(request):
    return render_html('not_found.html')
