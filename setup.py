## -*- encoding: utf-8 -*-

import os
from setuptools import setup, find_packages
from codecs import open # To open the README file with proper encoding

# Adapted from https://stackoverflow.com/questions/27664504/how-to-add-package-data-recursively-in-python-setup-py
def package_files(directory):
    return [os.path.join('..', path, filename)
                for (path, directories, filenames) in os.walk(directory)
                for filename in filenames]

setup(
    name = "sage-package",
    version = "0.0.2",
    description = 'Utilities for authoring SageMath packages',
    # get the long description from the README
    long_description = open("README.rst", encoding='utf-8').read(),
    url = 'https://github.com/sagemath/sage-package',
    author = 'Nicolas M. Thiéry et al.',
    author_email = 'nthiery@users.sf.net',
    license = 'GPLv2+',
    classifiers=[
      'Development Status :: 4 - Beta',
      'Intended Audience :: Science/Research',
      'Topic :: Software Development :: Build Tools',
      'Topic :: Scientific/Engineering :: Mathematics',
      'License :: OSI Approved :: GNU General Public License v2 or later (GPLv2+)',
      'Programming Language :: Python :: 2.7',
    ],
    keywords = "SageMath, Sphinx, packaging",
    packages = find_packages(),
    package_data = { 'sage_package': package_files("sage_package/themes") },
    entry_points = {
        'sphinx_themes': ['path = sage_package.sphinx:themes_path']
        },
)
