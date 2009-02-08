# -*- coding: utf-8 -*-
import time, uuid

from kinaj.models import Project
from kinaj.models import User
from kinaj.utils import expose
from kinaj.utils import make_id
from kinaj.utils import url_for
from kinaj.utils import wrap
from kinaj.utils.template.render import render_html
from kinaj.utils.template.render import render_xml 
from kinaj.utils.template.render import render_atom

from werkzeug import redirect


@expose('/')
def index(request):    
    if not request.is_xhr:
            
        context = {
            'featured': [wrap(p) for p in Project.allFeatured()],
            'active': reversed([wrap(p) for p in Project.allActiveNotFeatured()]),
            'user': {
                'roles': request.session.get('roles', []) 
            }
        }
        
        return render_html('index.html', context)
                                
    else:
        raise NotImplementedError('nothing here')


@expose('/projects/list/')
def plist(request):
    
    if not request.is_xhr:
        activeResults = [wrap(project) for project in Project.allActive()]
        
        context = {
            'active': reversed(activeResults),
            'user': {
                'roles': request.session.get('roles', []) 
            }
        }
        
        return render_html('/projects/list.html', context)


@expose('/projects/create/', roles=('admin',))
def create(request):
    if not request.is_xhr:
        if request.method == 'POST':
            p = Project()
            factories = {'active': bool, 'featured': bool, 'tags': lambda x: x.split(' ')}
            keys = ( 'active', 'featured', 'tags'
                   , 'category', 'name', 'text', 'preview_small', 'preview_big'
                   , 'download_mac', 'download_pc')
            
            p['id'] = make_id(request.form.get('name'))
            
            for k in keys:
                v = request.form.get(k)
                
                p[k] = (factories[k](v) if k in factories else v)
            
            resp = Project.create(p)

            return redirect(url_for('update', docid=p['id']))
        
        elif request.method == 'GET':
            context = {
                'project': {},
                'user': {
                    'roles': request.session.get('roles', []) 
                }
            }
            
            return render_html('projects/create.html', context)
            

@expose('/projects/retrieve/<path:docid>/')
def retrieve(request, docid):
    if request.method == 'GET':
        project = Project.retrieve(docid)
        
        if not request.is_xhr:
            context = {
                "project": project,
                'user': {
                    'roles': request.session.get('roles', []) 
                }
            }
            
            return render_html('projects/retrieve.html',context)


@expose('/projects/update/<path:docid>/', roles=('admin',))
def update(request, docid):
    if request.method == 'POST':
        if not request.is_xhr:
            p = Project.db.get(docid)
            factories = {'active': bool, 'featured': bool, 'tags': lambda x: x.split(' ')}
            keys = ( 'active', 'featured', 'tags'
                   , 'category', 'name', 'text', 'preview_small', 'preview_big'
                   , 'download_mac', 'download_pc')
            
            p['id'] = make_id(request.form.get('name'))
            
            for k in keys:
                v = request.form.get(k)
                
                p[k] = (factories[k](v) if k in factories else v)
            
            Project.update(p)

            return redirect(url_for('update', docid=docid))
        
    elif request.method == 'GET':
        if not request.is_xhr:
            project = Project.db.get(docid)
            project["tags"] = " ".join(project["tags"])

            context = {
                'project': project,
                'user': {
                    'roles': request.session.get('roles', []) 
                }
            }

            return render_html('projects/update.html',context)


@expose('/projects/delete/<path:docid>/', roles=('admin',))
def delete(request,docid):
    if not request.is_xhr:
        Project.delete(docid)
        return redirect(url_for('plist'))
        
    
@expose('/projects/feed/rss/')
def rss(request):
    if request.method == 'GET':
        active_doc_results = Project.allActive()
        active_results = [wrap(project) for project in active_doc_results]

        context = {
            'active': reversed(active_results),
            'user': {
                'roles': request.session.get('roles', []) 
            }
        }

        return render_xml('projects/rss2.xml', context)


@expose('/projects/feed/atom/')
def atom(request):
    if request.method == 'POST':
        activeDocResults = Project.allActive()
        activeResults = [wrap(project) for project in activeDocResults]
    
        context = {
            'active': reversed(activeResults),
            'user': {
                'roles': request.session.get('roles', []) 
            }
        }
    
        return render_atom('projects/atom.xml', context)
    

@expose('/projects/retrieve/<path:docid>/upload/', roles=('admin',))
def uploadAttachment(request, docid):
    if request.method == 'POST':
        doc = Project.db.get(docid)

        for file in request.files:
            Project.db.add_attachment(doc, request.files[file].read(), 
                                      request.files[file].filename, 
                                      content_type=request.files[file].content_type)

        return redirect(url_for('update', docid=docid))
    

@expose('/projects/retrieve/<path:docid>/delete/<attachment>', roles=('admin',))
def deleteAttachment(request, docid, attachment):
    doc = Project.db.get(docid)

    Project.db.delete_attachment(doc, attachment)

    return redirect(url_for('update', docid=docid))


@expose('/static/projects/<path:path>')
def attachment(request, path):
    if request.method == 'GET':
        return redirect('http://localhost:5984/kinaj-projects/%s' % path)
        
    else:
        raise NotImplementedError('Should be ACCESS DENIED')
            

# TODO: Implement complete CRUD mechanic for User
@expose('/users/login')
def login(request):
    """docstring for login"""
    if request.method == 'GET':
        context = {'referrer': request.args.get('referrer', url_for('index'))}
        
        return render_html('login.html', context)
        
    elif request.method == 'POST':
        
        username = request.form.get('username')
        password = request.form.get('password')
        
        user = User.db.get(username)
        
        if user and User.chkpwd(password, user['password']):
            request.session['id'] = uuid.uuid4().hex
            request.session['roles'] = user['roles'] or []
            
            user['session'] = request.session
            user['last_login'] = time.time()
            
            User.update(user)
            
            red = redirect(request.args.get('referrer', url_for('index')))
            
            return red
        
        context = {
            'referrer': request.args['referrer'],
            'user': {
                'roles': request.session.get('roles', []) 
            }
        }
        
        return render_html('login.html', context)


@expose('/users/logout')
def logout(request):
    """docstring for logout"""
    sid = request.session.get('id', None)
    
    if sid:
        user = tuple(User.db.view('session/users', key=sid))[0]['value']
        user.pop('session')
        User.db.save(user)
        
    red = redirect(url_for('index'))
    red.delete_cookie('com.kinaj.session')
    
    return red 
    

def not_found(request):
    return render_html('not_found.html')
