"""
setuptools utilities for SageMath packages
"""

from __future__ import absolute_import
import os
import sys
from codecs import open # To open the README file with proper encoding
from setuptools.command.test import test as TestCommand # for tests

class SageTest(TestCommand):
    """
    A TestCommand for running doctests with sage -t
    """
    def run_tests(self):
        errno = os.system("sage -t --force-lib .")
        if errno != 0:
            sys.exit(1)

def readfile(filename):
    """
    Utility to fetch information from separate utf-8 files

    EXAMPLE::

        sage: from sage_package.setuptools import read_file
        sage: read_file("README.rst")
        # sage-package: Utilities for authoring packages for SageMath
        ...
    """
    with open(filename,  encoding='utf-8') as f:
        return f.read()
