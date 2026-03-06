package com.oceanview.utils;

import jakarta.ws.rs.NameBinding;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@NameBinding
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.METHOD})
public @interface RolesAllowed {
    String[] value() default {}; // මෙතනට ADMIN, RECEPTIONIST වගේ කැමති ප්‍රමාණයක් දාන්න පුළුවන්
}