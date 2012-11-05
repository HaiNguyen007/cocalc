###
# 
# Library for working with JSON messages for Salvus.
#
# (c) 2012, William Stein
# 
# We use functions to work with messages to ensure some level of
# consistency, defaults, and avoid errors from typos, etc.
# 
###
#

defaults = require('misc').defaults
required = defaults.required


message = (obj) ->
    exports[obj.event] = (opts={}) ->
        if opts.event?
            throw "ValueError: must not define 'event' when calling message creation function (opts=#{JSON.stringify(opts)}, obj=#{JSON.stringify(obj)})"
        defaults(opts, obj)

############################################
# Sage session management; executing code 
############################################# 
# generic error emssages
message(
    event  : 'error'
    id     : undefined
    reason : undefined
)

# hub --> sage_server and browser --> hub
message(
    event  : 'start_session'
    id     : undefined
    limits : undefined
)

# hub --> browser
message( 
    event        : 'new_session'
    id           : required
    session_uuid : undefined
    limits       : undefined
)

# sage_server --> hub
message(
    event  : 'session_description'
    pid    : required
    limits : undefined
)

# browser --> hub --> sage_server
message(
    event        : 'send_signal'
    session_uuid : undefined   # from browser-->hub this must be set
    pid          : undefined   # from hub-->sage_server this must be set
    signal       : 2           # 2 = SIGINT
)

# browser <----> hub <--> sage_server
message(
    event        : 'terminate_session'
    session_uuid : undefined
    reason       : undefined
    done         : true
)

# browser --> hub --> sage_server
message(
    event        : 'execute_code'
    id           : undefined
    code         : required
    session_uuid : undefined
    preparse     : true
    allow_cache  : true
)
        
# sage_server --> hub_i --> hub_j --> browser
message(
    event        : 'output'
    id           : undefined
    stdout       : undefined
    stderr       : undefined
    done         : false
    session_uuid : undefined
)

############################################
# Ping/pong
#############################################
# browser --> hub
message(
    event   : 'ping'
    id      : undefined
)

# hub --> browser;   sent in response to a ping
message(
    event   : 'pong'
    id      : undefined        
)

############################################
# Account Management
#############################################

# client --> hub
message(
    event          : 'create_account'
    id             : undefined
    first_name     : required
    last_name      : required
    email_address  : required
    password       : required
    agreed_to_terms: required
)

# hub --> client
message (
    event          : 'account_creation_failed'
    id             : required
    reason         : required
)

# client <--> hub
message(
    event          : 'email_address_availability'
    id             : undefined
    email_address  : required
    is_available   : undefined
)

# client --> hub
message(
    id             : undefined
    event          : 'sign_in'
    email_address  : required
    password       : required
    remember_me    : false
)

# client --> hub
message(
    id             : undefined
    event          : 'sign_in_failed'
    email_address  : required
    reason         : required  
)

# hub --> client; sent in response to either create_account or log_in
message(
    event          : 'signed_in'
    id             : undefined
    account_id     : required
    first_name     : required
    last_name      : required
    email_address  : required
    plan_name      : required
)
    
# client --> hub
message(
    event          : 'sign_out'
    id             : undefined
)

# hub --> client
message(
    event          : 'signed_out'
    id             : undefined
)

# client --> hub
message(
    event          : 'change_email_address'
    id             : undefined    
    old_email_address : required
    new_email_address : required
    password          : required
)

# hub --> client
message(
    event          : 'changed_email_address'
    id             : undefined    
    old_email_address : required
    new_email_address : required
)

# client --> hub
message(
    event          : 'change_password'
    id             : undefined
    email_address  : required
    old_password   : required
    new_password   : required
)    
    

# hub --> client
# if error is true, that means the password was not changed; would
# happen if password is wrong (message:'invalid password').
message(
    event          : 'changed_password'
    id             : undefined    
    error          : undefined
    message        : undefined
)

# client --> hub
message(
    event             : 'change_email_address'
    id                : undefined
    old_email_address : required
    new_email_address : required    
    password          : required
)    
    
# client --> hub
message(
    event             : 'changed_email_address'
    id                : undefined
    error             : required
    message           : undefined  
    new_email_address : required    
)    

# client --> hub
message(
    event          : 'password_reset'
    id             : required
    email_address  : required
)
    
# hub --> client
# success true if message sent; success false if no such email_address in the database
message(
    event          : 'password_reset_response'
    id             : undefined    
    email_address  : required
    success        : required
    reason         : undefined
)

############################################
# User Feedback
#############################################

message
    event       : 'report_feedback'
    id          : undefined
    category    : required            # 'bug', 'idea', 'comment'
    description : required            # text
    nps         : undefined           # net promotor score; integer 1,2,...,9

message
    event       : 'feedback_reported'
    error       : undefined
    id          : required

message
    event       : 'get_all_feedback_from_user'
    error       : undefined
    id          : undefined

message
    event       : 'all_feedback_from_user'
    id          : required
    error       : undefined
    data        : required  # JSON list of objects
    
    
    
