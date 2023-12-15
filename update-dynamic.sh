#!/bin/bash
############################################################
# Help                                                     #
############################################################
Help()
{
   # Display Help
   echo "Update a dynamic plugin. Based on commands here: https://github.com/janus-idp/backstage-showcase/blob/main/showcase-docs/dynamic-plugins.md#local-configuration"
   echo
   echo "Syntax: update-dynamic [-p|h]"
   echo "options:"
   echo "p     folder name found in ./dynamic-plugins/wrappers"
   echo
}


############################################################
############################################################
# Main program                                             #
############################################################
############################################################
############################################################
# Process the input options. Add options as needed.        #
############################################################
# Get the options
while getopts ":h:p:" option; do
   case "${option}" in
      h) # display Help
         Help
         exit;;
      p) #input
         PLUGIN=${OPTARG};;
      *) # Invalid option
         echo "Error: Invalid option $option"
         Help
         exit;;
   esac
done

if [ -z "$PLUGIN" ]
then
    echo "Missing -p"
    Help
    exit
fi

cwd=$(pwd)
echo "building plugin"
cd ./dynamic-plugins/wrappers/$PLUGIN
yarn install
yarn export-dynamic
cd $cwd

echo "packing..."
archive=$(npm pack ./dynamic-plugins/wrappers/$PLUGIN/dist-dynamic)

echo "taring..."
tar -xzf "$archive" && rm "$archive"

echo "moving package"
mv package $(echo $archive | sed -e 's:\.tgz$::')
rm -r dynamic-plugins-root/$PLUGIN-* || true
mv $PLUGIN-* dynamic-plugins-root