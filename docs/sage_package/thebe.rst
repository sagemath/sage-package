Live SageMath examples in static HTML pages with Thebe and binder
=================================================================

Web pages may include live SageMath examples that can be edited and
executed online after clicking `Activate`. If you read this page, you
may have followed the `About` link of some of them:

- The documentation of some SageMath package, typically using the
  `sage-package <http://sage-package.readthedocs.io/en/latest/>`_ tools.
  See e.g. this `demo page <http://sage-package.readthedocs.io/en/latest/sage_package/sphinx-demo.html>`_,
and click `Activate`.

- `More SageMath tutorials <https://more-sagemath-tutorials.readthedocs.io/>`_

- (in the work) The `SageMath documentation <http://doc.sagemath.org/>`_,
  either online or locally.

We provide here some background about the Jupyter-based service behind
the scene, for readers and authors. A similar service is provided by
`SageMathCell <http://sagecell.sagemath.org/help.html>`, which see for
background. A brief comparison is provided below.

In a nutshell
-------------

Live code examples are handled by the `Thebe
<https://github.com/minrk/thebelab>`_ javascript library, configured
to run the computations on `mybinder.org <http://mybinder.org>`_,
using the latest version of `SageMath <http://sagemath.org>`_. See
below for details on those free and open source components.

This service is meant for casual use. As for any cloud-based service,
don't run calculations that could leak private information. See the
`binder faq <https://mybinder.readthedocs.io/en/latest/faq.html>`_ for
details.

Components
----------

`SageMath <http://sagemath.org>`_ is a general purpose open source
software for mathematical computations.

`Jupyter <http://jupyter.org/>`_ is a project that fosters open-source
software, open-standards, and services for interactive computing
across dozens of programming languages, including SageMath.

`JupyterLab <http://jupyterlab.readthedocs.io/>`_ is the
next-generation web-based user interface for Project Jupyter, meant to
phase out soon the classic Jupyter notebook.

`Thebe <https://github.com/minrk/thebelab>`_ is a small javascript
library based on `JupyterLab <http://jupyterlab.readthedocs.io/en/latest/>`_
that enables embedding live code examples in an HTML page. Upon
clicking `Run`, the code is sent to a Jupyter server for execution and
the result displayed back.

`Binder <https://mybinder.readthedocs.io/>`_ is a free and open source
service for temporary computations within an arbitrary execution
environment; `mybinder.org <mybinder.org>`_ is binder's original
instance. The execution environment is described by metadata files
hosted on a git repository.

For SageMath, the execution environment is described by default by this
simple `Dockerfile <https://github.com/sagemath/sage-binder-env/blob/master/Dockerfile>`_,
which uses the latest `SageMath Docker container <https://hub.docker.com/r/sagemath/sagemath/>`_.

For authors
-----------

Setting up Thebe+Binder+SageMath for you own HTML pages boils down to
adding the following header to each page::

    <!-- Thebe configuration !-->
    <script type="text/x-thebe-config">
      thebeConfig = {
        binderOptions: {
          repo: "sagemath/sage-binder-env",
        },
        stripPrompts: {
          inPrompt: 'sage: ',
          continuationPrompt: '....: ',
          selector: 'pre:contains("sage: ")',
        },
        kernelOptions: {
          name: "sagemath",
        },
        requestKernel: true
      }
    </script>
    <!-- Load the Thebe library !-->
    <script type="text/javascript" src="https://unpkg.com/thebelab@^0.1.0" ></script>
    <!-- Activate Thebe directly upon loading the page !-->
    <script>window.onload = function() { thebelab.bootstrap(); };</script>

and writing the examples as:

    <pre>
        sage: 1+1
        2
    </pre>

For further customization, see also the source of the `Thebe examples
<https://minrk.github.io/thebelab/>`_.

For the Sphinx-generated documentation of a Sage based project,
you can use the Sphinx extension provided by the
`Sage package authoring utilities <https://github.com/sagemath/sage-package>`_.
It includes some additional styling and goodies, including the
activate button.

If you need to customize the computation environment, for example by
installing additional packages, you can create your own Dockerfile,
based on the above, and hosted in some github repository. See this
`example <https://github.com/nthiery/sage-semigroups/blob/master/Dockerfile>`_.

Thebe versus SageMath Cell
--------------------------

`Thebe` is similar in principle to `SageMath Cell <http://sagecell.sagemath.org/>`_.
It introduces additional flexibility by enabling the customization of
the programming language (kernel), computing backend (e.g. a local
Jupyter server, ...) and executable environment (e.g. via binder).
It also targets a much broader community, with the potential to
relieve the SageMath community from maintaining a custom solution.
On the other hand it's still a relatively recent and quickly evolving
technology with less settled sustainability. Also the SageMath Cell
has been optimized to be more reactive on startup and reduce
resource consumption. Those optimizations have not yet been ported to
Thebe+binder.
