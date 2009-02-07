import hashlib, random

def hashpwd(password, algo='sha512', salt=None):
    salt = salt or hashlib.new(algo, str(random.random())).hexdigest()[:5]
    hpwd = hashlib.new(algo, ''.join((salt, password))).hexdigest()
    
    return '$'.join((algo, salt, hpwd))
    
    
def chkpwd(password, reference):
    algo, salt, _ = reference.split('$')
    
    if hashpwd(password, algo, salt) == reference: 
        return True
        
    return False