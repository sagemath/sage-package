"""
setuptools utilities for SageMath packages
"""

from __future__ import absolute_import
import os
import sys
from setuptools.command.test import test as TestCommand # for tests

class SageTest(TestCommand):
    """
    A TestCommand for running doctests with sage -t
    """
    def run_tests(self):
        errno = os.system("sage -t --force-lib .")
        if errno != 0:
            sys.exit(1)
