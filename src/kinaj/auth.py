from barrel import basic, form, combo, roles, cooper

from kinaj.models import User

class MixIn(object):

    session_key = 'com.kinaj.sessions'
    realm = 'KinajRealm'

    def valid_user(self, username, password):
        return User.valid_user(username, password)

    def session_dict(self, environ):
        return environ.get(self.session_key, {})


class MyBasic(MixIn, basic.BasicAuth): pass


class MyForm(MixIn, form.FormAuth): pass


class MyCombo(combo.BasicFormAuth):
    basic_auth = MyBasic
    form_auth = MyForm


my_authn = cooper.decorize(MyCombo)


class MyRoles(roles.RolesAuthz):
    def user_roles(self, username):
        return User.user_roles(username)


my_authz = cooper.decorize(MyRoles)


def secure(*allowed_roles):
    """Decorator to secure my apps with."""
    def decorate(app):
        return my_authn(my_authz(app, allowed_roles=allowed_roles))
    
    return decorate

    


        