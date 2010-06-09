# email setup
God::Contacts::Email.message_settings = {
  :from => 'god@kinaj.com'
}

God::Contacts::Email.server_settings = {
  :address => 'localhost',
  :port => 25,
  :domain => 'kinaj.com'
}

God.contact(:email) do |c|
  c.name = 'alx.email'
  c.email = 'alx@kinaj.com'
  c.group = 'adm'
end


God.contact(:email) do |c|
  c.name = 'janik.email'
  c.email = 'janik@kinaj.com'
  c.group = 'adm'
end

# jabber setup
God::Contacts::Jabber.settings = { :host => 'talk.google.com',
                                   :jabber_id => 'god@kinaj.com',
                                   :password  => 'Dr0ss0m187' }

God.contact(:jabber) do |c|
  c.name = 'alx.jabber'
  c.jabber_id = 'alx@kinaj.com'
  c.group = 'adm'
end


# nginx watcher
God.watch do |w|
  w.pid_file = "/var/run/nginx.pid"
  w.name = "nginx"
  w.interval = 30.seconds # default
  w.start = "/usr/sbin/nginx -c /etc/nginx/nginx.conf"
  w.stop = "kill cat #{w.pid_file}"
  w.restart = "kill -HUP `cat #{w.pid_file}`"
  w.start_grace = 10.seconds
  w.restart_grace = 10.seconds

  w.behavior(:clean_pid_file)

  # determine the state on startup
  w.transition(:init, { true => :up, false => :start}) do |on|
    on.condition(:process_running) do |c|
      c.running = true
    end
    
  end
  
  # determine when process has finished starting
  w.transition([:start, :restart], :up) do |on|
    on.condition(:process_running) do |c|
      c.running = true
    end

    # failsafe
    on.condition(:tries) do |c|
      c.times = 5
      c.transition = :start
    end
  end

  # start if process is not running
  w.transition(:up, :start) do |on|
    on.condition(:process_exits) do |c|
      # notify if process exits
      c.notify = { :contacts => [ 'adm' ], :priority => 1, :category => 'webstack' }
    end
  end

  w.transition(:up, :restart) do |on|
    on.condition(:http_response_code) do |c|
      c.host = '127.0.0.1'
      c.port = 80
      c.path = '/nginx_status'
      c.headers = { 'host' => 'admin.kinaj.com' }
      c.code_is_not = %w{200 302}
      c.times = 2
      c.timeout = 2
      c.notify = { :contacts => [ 'adm' ], :priority => 1, :category => 'webstack' }
    end
  end

  # lifecycle
  w.lifecycle do |on|
    on.condition(:flapping) do |c|
      c.to_state = [:start, :restart]
      c.times = 5
      c.within = 5.minute
      c.transition = :unmonitored
      c.retry_in = 10.minutes
      c.retry_times = 5
      c.retry_within = 2.hours
    end
  end
end
