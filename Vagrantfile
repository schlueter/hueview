Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/xenial64"
  config.vm.network "private_network", ip: "192.168.42.13"
  config.vm.provision :ansible,
    playbook: "ansible/main.yml",
    verbose: "-vv",
    raw_arguments: [ "--diff" ],
    sudo: true,
    extra_vars: {
      hueview_install_dir: "/vagrant"
    }
end
