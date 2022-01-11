package com.xbstar.graph.domain;

/**
 * Created by Simon on 2019/9/23 13:30
 */

public class Person {

    private long id;
    private String name;
    private String address;
    private String telephone;
    private String birthday;
    private String identity;
    private long institution_id;
    private String institution_name;

    public long getInstitution_id() {
        return institution_id;
    }

    public void setInstitution_id(long institution_id) {
        this.institution_id = institution_id;
    }

    public String getInstitution_name() {
        return institution_name;
    }

    public void setInstitution_name(String institution_name) {
        this.institution_name = institution_name;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getBirthday() {
        return birthday;
    }

    public void setBirthday(String birthday) {
        this.birthday = birthday;
    }

    public String getIdentity() {
        return identity;
    }

    public void setIdentity(String identity) {
        this.identity = identity;
    }
}
