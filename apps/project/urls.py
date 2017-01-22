from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index),
    url(r'^home$', views.home, name="home"),
    url(r'^condo$', views.condo, name="condo"),
    url(r'^rent$', views.rent, name="rent"),
]
