Vagrant.configure("2") do |config|
  config.vm.box = "bento/ubuntu-18.04"
  config.vm.network "private_network", ip: "192.168.42.13"
  config.vm.provision :ansible,
    playbook: "ansible/main.yml",
    verbose: "-vv",
    raw_arguments: [ "--diff" ],
    extra_vars: {
      hueview_dir: "/vagrant",
      ansible_python_interpreter: "/usr/bin/python3"
    }
end
