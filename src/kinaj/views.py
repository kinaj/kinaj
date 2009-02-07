# -*- coding: utf-8 -*-
import simplejson, time, uuid

from kinaj.auth import secure
from kinaj.models import Project
from kinaj.models import User
from kinaj.utils import chkpwd
from kinaj.utils import expose
from kinaj.utils import make_id
from kinaj.utils import url_for
from kinaj.utils import wrap
from kinaj.utils.template.render import render_html
from kinaj.utils.template.render import render_xml 
from kinaj.utils.template.render import render_atom

from werkzeug import Response, redirect


@expose('/')
def index(request):
    print request.authorization
    if not request.is_xhr:
        context = {
            'featured': [wrap(project) for project in Project.allFeatured()],
            'active': reversed([wrap(project) for project in Project.allActiveNotFeatured()])
        }
        
        return render_html('index.html', context)
                                
    else:
        raise NotImplementedError('nothing here')


@expose('/projects/list/', roles=('admin',))
def list(request):
    
    if not request.is_xhr:
        activeResults = [wrap(project) for project in Project.allActive()]
        
        context = {
            'active':reversed(activeResults)
        }
        
        return render_html('/projects/list.html', context)
    else:
        raise NotImplementedError('nothing here')


@expose('/projects/create/', roles=('admin',))
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


@expose('/projects/update/<path:docid>/', roles=('admin',))
def update(request, docid):
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
            
            resp = 'ok'
            
            return Response(resp,mimetype='text/plain')
        
    elif request.method == 'GET':
        if not request.is_xhr:
            project = Project.db.get(docid)
            project["tags"] = " ".join(project["tags"])

            context = {
                'project': project 
            }

            return render_html('projects/update.html',context)
        
        else:
            raise NotImplementedError('nothing here')


@expose('/projects/delete/<path:docid>/', roles=('admin',))
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
    

@expose('/projects/retrieve/<path:docid>/upload/', roles=('admin',))
def uploadAttachment(request, docid):
    """docstring for upload"""
    doc = Project.db.get(docid)

    for file in request.files:
        Project.db.add_attachment(doc, request.files[file].read(), request.files[file].filename, content_type=request.files[file].content_type)

    return redirect(url_for('update', docid=docid))
    

@expose('/projects/retrieve/<path:docid>/delete/<attachment>', roles=('admin',))
def deleteAttachment(request, docid, attachment):
    """docstring for upload"""
    doc = Project.db.get(docid)

    Project.db.delete_attachment(doc, attachment)

    return redirect(url_for('update', docid=docid))


@expose('/static/projects/<path:path>')
def attachment(request, path):
    """docstring for attachments"""
    if request.method == 'GET':
        return redirect('http://localhost:5984/kinaj-projects/%s' % path)
    else:
        raise NotImplementedError('Should be ACCESS DENIED')
            
            
@expose('/users/login')
def login(request):
    """docstring for login"""
    
    if request.method == 'GET':
        
        context = {
            'referrer': request.args['referrer']
        }
        
        return render_html('login.html', context)
        
    elif request.method == 'POST':
        
        username = request.form.get('username')
        password = request.form.get('password')
        
        user = User.db.get(username)
        
        reference = user['password']
        
        if chkpwd(password, reference):
            session_id = uuid.uuid4().hex
            
            user['session_id'] = session_id
            user['last_login'] = time.time()
        
            User.update(user)
            
            red = redirect(request.args['referrer'])
            red.set_cookie('session_id', session_id)
            
            return red
        
        context = {
            'referrer': request.args['referrer']
        }
        
        return render_html('login.html', context)


@expose('/users/logout')
def logout(request):
    """docstring for logout"""
    red = redirect(url_for('index'))
    red.delete_cookie('session_id')
    
    return red
    
    return 
    

def not_found(request):
    return render_html('not_found.html')
