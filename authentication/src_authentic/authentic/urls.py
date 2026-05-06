"""
URL configuration for authentic project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from api.views import*
from django.conf import settings
from django.conf.urls.static import static




#from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView







urlpatterns = [
    path('admin/', admin.site.urls),

    # authentication endpoints for users (login/register etc.)
    path('api/auth/', include('api.urls')),

    # video endpoints under the same /api/ prefix so frontend proxy works
    # video.urls already defines "videos/" paths, so mounting at /api/ produces
    # /api/videos/, /api/videos/upload/, etc.
    path('api/', include('video.urls')),

    #path('create_user/', create_user,name="create_user"),
    #path('api/token/', TokenObtainPairView.as_view(),name="token_obtain_pair"),
    #path('api/token/reflesh', TokenRefreshView.as_view(),name="token_refresh"),
    #path('api-auth/',include('rest_framework.urls' )),
    #path('accounts/', include('allauth.urls')),
    #path('callback/', google_login_callback,name="callback"),
    #path('api/auth/user', user_detail,name="user_detail"),
   # path('api/google/validate_token/', validate_google_token,name="validate_token"),
    #path("", include('api.urls')),

]
# only when DEBUG is True – `runserver` will serve the files
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)

    
