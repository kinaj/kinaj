# -*- coding: utf-8 -*-
import simplejson

from datetime import datetime

from kinaj.models import Project
from kinaj.utils import expose, make_id, url_for, wrap
from kinaj.utils.template.render import render_html, render_xml, render_atom

from werkzeug import Response, redirect


@expose('/')
def index(request):

    if not request.is_xhr:
        context = {
            'featured': [wrap(project) for project in Project.allFeatured()],
            'active': reversed([wrap(project) for project in Project.allActiveNotFeatured()])
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
            p['name'] = request.form.get('name')
            p['text'] = request.form.get('text')
            p['active'] = bool(request.form.get('active'))
            p['featured'] = bool(request.form.get('featured'))
            p['category'] = request.form.get('category')
            p['tags'] = request.form.get('tags').split(' ')
            p['preview_small'] = request.form.get('preview_small')
            p['preview_big'] = request.form.get('preview_big')
            p['download_mac'] = request.form.get('download_mac')
            p['download_pc'] = request.form.get('download_pc')
            
            resp = Project.create(p)

            return redirect(url_for('update', docid=p['id']))
        
        elif request.method == 'GET':
            context = {
                "project": {}
            }
            return render_html('projects/create.html',context)
        
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
            p = Project.db.get(docid)
            p['id'] = make_id(request.form.get('name'))
            p['name'] = request.form.get('name')
            p['text'] = request.form.get('text')
            p['active'] = bool(request.form.get('active'))
            p['featured'] = bool(request.form.get('featured'))
            p['category'] = request.form.get('category')
            p['tags'] = request.form.get('tags').split(' ')
            p['preview_small'] = request.form.get('preview_small')
            p['preview_big'] = request.form.get('preview_big')
            p['download_mac'] = request.form.get('download_mac')
            p['download_pc'] = request.form.get('download_pc')

            Project.update(p)

            return redirect(url_for('update', docid=docid))
        
        else:
            
            resp = '''ok'''
            
            return Response(resp,mimetype='text/plain')
        
    elif request.method == 'GET':
        if not request.is_xhr:
            project = Project.db.get(docid)
            project["tags"] = " ".join(project["tags"])

            print project

            context = {
                'project': project 
            }

            return render_html('projects/update.html',context)
        
        else:
            raise NotImplementedError('nothing here')


@expose('/projects/delete/<path:docid>/')
def delete(request,docid):
    if not request.is_xhr:
        Project.delete(docid)
        return redirect(url_for('list'))
        
    else:
        if request.method == 'DELETE':
            Project.delete(docid)
            
            return Response('''ok''',mimetype='text/plain')
        
        else:
            raise NotImplementedError('nothing here')


@expose('/projects/upload/<path:docid>')
def upload(request, docid):
    """docstring for upload"""
    doc = Project.db.get(docid)
    
    for file in request.files:
        print file
        print request.files[file]
        Project.db.add_attachment(doc, request.files[file].read(), request.files[file].filename, content_type=request.files[file].content_type)
    
    return redirect(url_for('update', docid=docid))
    
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
